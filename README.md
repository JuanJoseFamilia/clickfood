Documentación Técnica Completa: Ecosistema ClickFood

1. Descripción del Proyecto
ClickFood es un ecosistema tecnológico integral para la gestión gastronómica. La plataforma no solo abarca la administración operativa (POS, Inventario, RRHH), sino que integra inteligencia de negocios mediante modelos predictivos y extiende su accesibilidad a través de aplicaciones móviles.

El sistema utiliza una arquitectura de Microservicios API-First, permitiendo que múltiples clientes (Web, Móvil, Dashboard) consuman una lógica de negocio centralizada y escalable.

2. Stack Tecnológico Ampliado

El proyecto orquesta múltiples tecnologías para cubrir el frontend, backend, movilidad y ciencia de datos.

        2.1 Web Frontend (Administración y POS)
        Framework: React.js + Vite.

        Estilos: Tailwind CSS.

        Visualización: Recharts (Dashboard analítico).

        2.2 Mobile (Cliente/Staff)
        Tecnología: Flutter (Dart).

        Enfoque: Multiplataforma (iOS/Android) con una única base de código.

        Comunicación: Consumo de API RESTful centralizada.

        2.3 Backend y Datos
        Servidor Principal: Node.js con Express (REST API).

        Base de Datos: PostgreSQL (vía Supabase).

        Autenticación: Supabase Auth (Integrado en Web y Móvil).

        2.4 Inteligencia Artificial y Data Science
        Servicio de IA: Microservicio independiente (Python/Flask/FastAPI).

Propósito: Análisis predictivo de demanda.


3. Arquitectura del Sistema

La solución se estructura en módulos interconectados:

        *Núcleo (Backend API): Centraliza la lógica de negocio, validaciones y conexión a la base de datos.

        *Cliente Web (Dashboard): Interfaz para gerentes y cajeros.

        *Cliente Móvil (App): Interfaz ligera para camareros (toma de comandas en mesa) o clientes finales.

        *Motor de IA: Servicio que corre en segundo plano, analiza el histórico de la base de datos y retorna proyecciones al Dashboard.



  4. Funcionalidades Clave
      *Módulo Predictivo (IA)
      Este componente diferencia a ClickFood de un POS tradicional. Utiliza algoritmos de aprendizaje automático para:

      Predicción de Demanda: Analiza el histórico de ventas para predecir qué platos serán los más solicitados en días específicos.

      Optimización de Inventario: Sugiere compras de insumos basadas en la demanda proyectada, reduciendo el desperdicio (mermas).

      *Integración Móvil
      Extensión del sistema para dispositivos portátiles:

      Sincronización en Tiempo Real: Los pedidos tomados desde el móvil impactan instantáneamente en la cocina y en la caja central.

      Movilidad del Staff: Permite a los camareros gestionar mesas y estatus de pedidos sin desplazarse a una terminal fija.

      *Gestión Administrativa (Web)
      Usuarios y Roles: Control de acceso jerárquico (Admin, Empleado, Cliente).

      Recursos Humanos: Gestión y puestos de empleados.

      Mapa de Mesas: Visualización gráfica del estado de las mesas (Disponible/Reservada).

      *Gestión de Pedidos (Omnicanal)
      Centraliza las órdenes provenientes tanto de la Web como de la App Móvil:

  Flujo de estados: Pendiente → En preparación → Completado.

  Registro de Tiempos: Timestamp exacto para medir eficiencia en cocina.


  5. Guía de Despliegue Técnico
  Configuración del Entorno
      El sistema requiere la orquestación de los servicios Web, Móvil y el servicio de IA.

      Backend (Node.js):

      Configurar variables de entorno (.env) con credenciales de Supabase.

      Exponer puertos para permitir peticiones CORS desde la Web y la App Móvil.

      Servicio de IA:

      Requiere conexión de lectura a la base de datos SupaBase para entrenar/alimentar el modelo.

      Expone endpoints específicos que son consumidos por el Dashboard para mostrar gráficas.

      Frontend Web & Móvil:

      Ambos clientes deben apuntar a la URL base del Backend principal.

      La autenticación es compartida; un usuario creado en la web puede loguearse en la app móvil.