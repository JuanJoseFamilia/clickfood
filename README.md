ClickFood: Sistema de Gestión de Restaurantes 

Descripción del Proyecto

ClickFood es un sistema integral de gestión de restaurantes (Point of Sale, POS, y Backend Dashboard) diseñado para optimizar las operaciones diarias, desde la toma de pedidos y la gestión de inventario hasta la administración de usuarios y la centralización de datos en tiempo real.

Este proyecto sigue una arquitectura de Microservicios API-First, utilizando tecnologías modernas de JavaScript tanto en el Frontend como en el Backend.

Tecnologías Utilizadas

Componente

Tecnología

Descripción

Frontend
-React + Tailwind CSS
-Interfaz de usuario moderna, modular y completamente responsiva, utilizando componentes funcionales y hooks.
-Gráficos
-Recharts

Visualización de datos en el Dashboard (ventas diarias, categorías).

Backend
-Node.js + Express
-Servidor API RESTful construido sobre un entorno de Módulos ES (import/export).
-Base de Datos
-PostgreSQL vía Supabase
-Base de datos relacional robusta con servicios de autenticación y funciones de backend.
-ORM/Cliente
-Supabase Client
-Manejo directo de la comunicación y consultas SQL (PostgREST) a la base de datos.



Estructura de la Aplicación

El proyecto se divide en dos directorios principales: frontend (React) y backend (Node/Express).

Backend (/backend)

-index.js: Punto de entrada del servidor. Configura Express, Cors y enlaza todas las rutas con sus respectivos prefijos (ej: /pedidos).

-/src/routes: Define los endpoints de la API (ej: /pedidos, /usuarios). Usa router.get('/', ...) y router.patch('/:id', ...)

-/src/controllers: Contiene la lógica de negocio. Recibe el req, valida los datos y llama al Modelo.

-/src/models: Capa de datos. Contiene la lógica de Supabase (CRUD) para interactuar directamente con las tablas (ej: Pedido.crear()).

-/config/supabase.js: Archivo de inicialización del cliente de Supabase.



Frontend (/frontend/src/)

dashboard.jsx: Componente principal que maneja el layout y el estado de la navegación.

CRUDModal (función): Componente genérico y reutilizable que maneja la interfaz de creación, lectura, edición y eliminación (CRUD) para todas las entidades (Pedidos, Mesas, Usuarios, etc.).



Funcionalidades Clave Implementadas

El sistema proporciona una administración completa de los recursos principales del restaurante:

1-Gestión de Usuarios (CRUD):

    -Permite crear, leer, actualizar y eliminar usuarios.
    -Dropdown de Rol: Centraliza la asignación de roles (cliente, empleado, administrador).

2-Gestión de Empleados (CRUD):

    -Maneja datos específicos del empleado (id_usuario, puesto, salario).

3-Gestión de Mesas (CRUD):

    -Dropdown de Estado: Permite cambiar el estado de la mesa (Disponible, Reservada) fácilmente.

4-Gestión de Pedidos (CRUD):

    -Integración completa con la tabla pedidos de PostgreSQL.

    -Dropdown de Estado: Permite cambiar el flujo del pedido (Pendiente, En preparación, Completado).

    -Selector de Fecha/Hora: Usa el tipo de input datetime-local para garantizar el formato de timestamp.




Configuración e Instalación

1-Backend Setup

Navega a la carpeta /backend.

Instala las dependencias:

npm install express cors dotenv @supabase/supabase-js bcrypt


Crea un archivo .env en la raíz de la carpeta /backend y añade tus claves de Supabase.

# .env
SUPABASE_URL="TURL_DE_SUPABASE"
SUPABASE_KEY="CLAVE_ANON_O_SERVICE_ROLE"
PORT=5000



Inicia el servidor:

node index.js


2-Frontend Setup (React)

Navega a la carpeta /frontend.

Instala las dependencias:

npm install react react-dom recharts lucide-react tailwindcss postcss autoprefixer


Inicia la aplicación:

npm run dev

(Abrir http://localhost:3000 en tu navegador).

Desarrollado con enfoque en modularidad, escalabilidad y buenas prácticas.