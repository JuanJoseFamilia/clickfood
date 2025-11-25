import os
import sys
from cmdstanpy import install_cmdstan

print("--- 🛠️ INICIANDO REPARACIÓN DE ENTORNO WINDOWS (V2) ---")

try:
    print("\n1. 📥 Instalando Compilador C++ y Motor CmdStan...")
    print("   -----------------------------------------------------------------------")
    print("   ⚠️  IMPORTANTE: Esto descargará RTools (~100MB) y CmdStan (~50MB).")
    print("   ⚠️  Puede tardar entre 5 y 10 minutos dependiendo de tu internet.")
    print("   ⚠️  Si aparece una ventana pidiendo permisos, acéptala.")
    print("   -----------------------------------------------------------------------")
    
    # Usamos la función de alto nivel con compiler=True
    # Esto le dice a la librería: "Si estás en Windows y falta el compilador, instálalo tú"
    success = install_cmdstan(compiler=True, overwrite=True, verbose=True)
    
    if success:
        print("\n✅ Instalación completada exitosamente.")
    else:
        print("\n⚠️ La instalación terminó pero no devolvió confirmación estándar.")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("-" * 30)
    print("Si el error persiste, intenta instalar RTools40 manualmente desde:")
    print("https://cran.r-project.org/bin/windows/Rtools/rtools40.html")
    sys.exit(1)

print("\n🎉 ¡TODO LISTO!")
print("Prueba ejecutar nuevamente: python test_prophet.py")