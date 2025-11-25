# ai-service/Dockerfile
# Dockerfile para el servicio de predicción de IA

FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY src/ ./src/

# Crear directorio para modelos
RUN mkdir -p models

# Exponer puerto
EXPOSE 8000

# Variables de entorno
ENV PYTHONUNBUFFERED=1

# Comando de inicio
CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]