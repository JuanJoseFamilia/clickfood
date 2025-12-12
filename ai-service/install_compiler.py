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
    
    # Usamos una ruta sin espacios para evitar problemas con la instalación
    install_dir = os.path.expandvars(r"C:\.cmdstan")
    os.makedirs(install_dir, exist_ok=True)

    # Aseguramos que cmdstanpy vea la ruta sin espacios configurando
    # variables de entorno. No todos los call-sites aceptan un argumento
    # para directorio, así que evitamos pasar parámetros no soportados.
    os.environ.setdefault("CMDSTAN", install_dir)
    os.environ.setdefault("CMDSTAN_HOME", install_dir)
    os.environ.setdefault("CMDSTAN_DIR", install_dir)

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