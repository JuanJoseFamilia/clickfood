"""
ai-service/src/api/app.py
Servicio de predicción de demanda para ClickFood
"""
import os
import sys


# Esto inyecta la librería tbb.dll al sistema antes de cargar Prophet
try:
    from cmdstanpy import cmdstan_path
    # Buscamos la carpeta donde está la DLL perdida
    tbb_path = os.path.join(cmdstan_path(), 'stan', 'lib', 'stan_math', 'lib', 'tbb')
    
    # La agregamos al principio del PATH del sistema
    os.environ['PATH'] = tbb_path + ';' + os.environ.get('PATH', '')
    print(f"Parche TBB aplicado exitosamente.")
    print(f"Ruta inyectada: {tbb_path}")
except Exception as e:
    print(f"Advertencia: No se pudo aplicar el parche TBB: {e}")
# --------------------------------------------

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List
import pandas as pd
import numpy as np
from prophet import Prophet
import json
from prophet.serialize import model_to_json, model_from_json

app = FastAPI(title="ClickFood AI Service", version="1.0.3")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos de datos ---
class PredictionRequest(BaseModel):
    restaurante_id: int
    fecha: str
    hora: int
    producto_id: Optional[int] = None

class TrainingRequest(BaseModel):
    restaurante_id: int
    datos_historicos: List[dict]

class PredictionResponse(BaseModel):
    restaurante_id: int
    fecha: str
    hora: int
    demanda_predicha: float
    confianza: float
    recomendacion_stock: int
    nivel_demanda: str

# --- Simulación de base de datos en memoria ---
modelos_entrenados = {}

# --- Funciones Auxiliares ---

def cargar_modelo(restaurante_id: int):
    modelo_path = f"models/restaurante_{restaurante_id}_model.json"
    if restaurante_id in modelos_entrenados:
        return modelos_entrenados[restaurante_id]

    if os.path.exists(modelo_path):
        try:
            with open(modelo_path, 'r') as fin:
                modelo = model_from_json(json.load(fin))
                modelos_entrenados[restaurante_id] = modelo
                return modelo
        except Exception as e:
            print(f"Error cargando modelo: {e}")
            return None
    return None

def guardar_modelo(restaurante_id: int, modelo):
    os.makedirs("models", exist_ok=True)
    modelo_path = f"models/restaurante_{restaurante_id}_model.json"
    with open(modelo_path, 'w') as fout:
        json.dump(model_to_json(modelo), fout)

def calcular_nivel_demanda(demanda: float, percentil_50: float, percentil_75: float):
    if demanda < percentil_50: return "baja"
    elif demanda < percentil_75: return "media"
    else: return "alta"

# --- Endpoints ---

@app.get("/")
async def root():
    return {"servicio": "ClickFood AI", "estado": "activo con parche"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/train", response_model=dict)
async def entrenar_modelo(request: TrainingRequest):
    try:
        
        if len(request.datos_historicos) < 30:
            raise HTTPException(status_code=400, detail="Mínimo 30 registros requeridos")
        
        df = pd.DataFrame(request.datos_historicos)
        df['ds'] = pd.to_datetime(df['fecha'] + ' ' + df['hora'].astype(str) + ':00:00')
        df_prophet = pd.DataFrame({'ds': df['ds'], 'y': df['pedidos']})
        
        modelo = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )
        modelo.fit(df_prophet)
        
        guardar_modelo(request.restaurante_id, modelo)
        modelos_entrenados[request.restaurante_id] = modelo
        
        return {
            "success": True,
            "message": "Modelo entrenado exitosamente",
            "registros": len(df)
        }
        
    except HTTPException: raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@app.post("/api/predict", response_model=PredictionResponse)
async def predecir_demanda(request: PredictionRequest):
    try:
        modelo = modelos_entrenados.get(request.restaurante_id)
        if modelo is None:
            modelo = cargar_modelo(request.restaurante_id)
            if modelo is None:
                raise HTTPException(status_code=404, detail="Modelo no encontrado. Entrena primero.")
            modelos_entrenados[request.restaurante_id] = modelo
        
        fecha_str = f"{request.fecha} {request.hora}:00:00"
        forecast = modelo.predict(pd.DataFrame({'ds': [pd.to_datetime(fecha_str)]}))
        
        demanda = max(0, forecast['yhat'].values[0])
        confianza = min(100, max(0, 100 - (forecast['yhat_upper'].values[0] - forecast['yhat_lower'].values[0]) / 2))
        
        return PredictionResponse(
            restaurante_id=request.restaurante_id,
            fecha=request.fecha,
            hora=request.hora,
            demanda_predicha=round(demanda, 2),
            confianza=round(confianza, 2),
            recomendacion_stock=int(np.ceil(demanda * 1.2)),
            nivel_demanda=calcular_nivel_demanda(demanda, 30, 50)
        )
    except HTTPException: raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/api/predict/week/{restaurante_id}")
async def predecir_semana(restaurante_id: int):
    try:
        modelo = modelos_entrenados.get(restaurante_id)
        if modelo is None:
            modelo = cargar_modelo(restaurante_id)
            if modelo is None:
                raise HTTPException(status_code=404, detail="Modelo no encontrado")
            modelos_entrenados[restaurante_id] = modelo
        
        fechas = pd.date_range(start=datetime.now().replace(minute=0, second=0), periods=168, freq='H')
        forecast = modelo.predict(pd.DataFrame({'ds': fechas}))
        
        predicciones = []
        for _, row in forecast.iterrows():
            predicciones.append({
                'fecha': row['ds'].strftime('%Y-%m-%d'),
                'hora': row['ds'].hour,
                'demanda_predicha': max(0, round(row['yhat'], 2)),
                'demanda_minima': max(0, round(row['yhat_lower'], 2)),
                'demanda_maxima': max(0, round(row['yhat_upper'], 2))
            })
        
        return {"restaurante_id": restaurante_id, "predicciones": predicciones}
    except HTTPException: raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/api/stock-recommendation/{restaurante_id}")
async def recomendar_stock(restaurante_id: int):
    try:
        modelo = cargar_modelo(restaurante_id)
        if modelo is None: raise HTTPException(status_code=404, detail="Modelo no encontrado")
        
        fechas = pd.date_range(start=datetime.now().replace(minute=0, second=0), periods=24, freq='H')
        forecast = modelo.predict(pd.DataFrame({'ds': fechas}))
        
        demanda_total = forecast['yhat'].sum()
        demanda_pico = forecast['yhat'].max()
        hora_pico = forecast.loc[forecast['yhat'].idxmax(), 'ds'].hour
        
        return {
            "restaurante_id": restaurante_id,
            "demanda_total_24h": round(max(0, demanda_total), 2),
            "demanda_pico": round(max(0, demanda_pico), 2),
            "stock_recomendado": int(np.ceil(demanda_total * 1.25)),
            "hora_pico_predicha": int(hora_pico),
            "recomendacion": "Aumentar stock" if demanda_pico > 50 else "Stock normal"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)