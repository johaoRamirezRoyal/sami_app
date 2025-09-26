# SAMI APP — Sistema de Administración y Manejo Institucional (Versión React Native)

**Propiedad exclusiva del Colegio Real Royal School**

---

## Descripción General

SAMI APP es una aplicación móvil multiplataforma desarrollada con React Native y Expo, orientada a la gestión administrativa y académica del Colegio Real Royal School. Su arquitectura modular facilita la colaboración entre los diferentes actores institucionales (administradores, docentes, estudiantes, acudientes y personal de apoyo), permitiendo el acceso seguro y eficiente a herramientas especializadas para cada proceso.

La estructura del proyecto promueve la reutilización de componentes, la separación de responsabilidades y la escalabilidad, siguiendo buenas prácticas de desarrollo móvil.

---

## Funcionalidades Principales  

| Área                  | Funcionalidades Clave                                                                                                                                         |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Gestión Académica** | Asistencia y llegadas tarde, control de cursos y salones, periodos, calificaciones, matrícula, egresados, áreas y dimensiones.                               |
| **Gestión Administrativa** | Inventario institucional, reportes, reservas de salones, mantenimiento, recursos, proveedores, contabilidad, prefactura, renovaciones, biblioteca, capacitaciones. |
| **Gestión de Usuarios** | Administración de perfiles y sesiones, autenticación, permisos, padres/acudientes, vinculación y control de acceso.                                         |
| **Comunicación**      | Notificaciones internas, alertas, confirmaciones y envío de correos electrónicos.                                                                            |
| **Documentación**     | Generación de reportes (PDF/Excel), carnets, certificados, firmas digitales y gestión documental.                                                             |
| **Otros Módulos**     | Admisiones, solicitudes, actividades extraescolares, sección de ayuda/tutoriales, historial de uso, configuraciones generales, zonas, firmas, etc.           |

Cada módulo está diseñado para cubrir procesos específicos, con formularios, reportes y flujos de trabajo adaptados a los distintos roles institucionales.

---

## Tecnologías y Arquitectura

- **Frontend:** React Native, Expo, JavaScript (modular), StyleSheet para estilos.
- **Backend:** API REST (configurada en `components/api/`).
- **Base de datos:** (Gestionada por el backend, no incluida en este repositorio).
- **Librerías y Frameworks:** Expo, React Navigation, Axios, y otras dependencias de React Native.
- **Despliegue:** Expo Go, emuladores Android/iOS, dispositivos físicos.
- **Seguridad:** Control de sesiones, validación de roles, protección de rutas y datos sensibles.

---

## Estructura de Carpetas y Archivos

| Carpeta / Archivo                | Descripción                                                                                 |
|----------------------------------|--------------------------------------------------------------------------------------------|
| **App.js**                       | Punto de entrada principal de la aplicación. Configura navegación y contexto global.        |
| **index.js**                     | Inicializa la app con Expo.                                                                 |
| **package.json**                 | Define dependencias, scripts y metadatos del proyecto.                                     |
| **assets/**                      | Recursos estáticos: imágenes, íconos, fondos, etc.                                         |
| **components/**                  | Componentes reutilizables y utilidades. Subcarpetas por tipo de componente.                |
| ├── api/                         | Configuración de la API y funciones para llamadas HTTP.                                    |
| ├── nav/                         | Componentes de navegación personalizados (barra, drawer, etc.).                            |
| ├── notification/                | Componentes para mostrar notificaciones y alertas.                                         |
| ├── sesion/                      | Funciones y componentes para gestión de sesión de usuario.                                 |
| ├── utils/                       | Funciones utilitarias generales.                                                           |
| └── sin_uso/                     | Componentes no utilizados actualmente (cámara, escáner alternativo, etc.).                 |
| **hookes/**                      | Hooks personalizados para lógica de negocio (asistencias, permisos, sesión, etc.).         |
| **pages/**                       | Pantallas principales de la app, organizadas por funcionalidad.                            |
| ├── inicio/                      | Pantalla de bienvenida y presentación.                                                     |
| ├── login/                       | Pantallas de login y splash.                                                               |
| ├── llegadas_tardes/             | Gestión de asistencias y llegadas tarde.                                                   |
| ├── lis.Inventario/              | Listado y reporte de inventario institucional.                                             |
| ├── reserve/                     | Reserva de salones y consulta de disponibilidad.                                           |
| ├── perfil/                      | Visualización y edición del perfil de usuario.                                             |
| ├── camera/                      | Escaneo de códigos QR para registro de asistencia.                                         |
| └── help/                        | Sección de ayuda, tutoriales y navegación para el usuario.                                 |
| **styles/**                      | Archivos de estilos para cada pantalla o componente, usando StyleSheet de React Native.    |
| **.expo/** y **.expo-shared/**   | Configuración y recursos generados por Expo.                                               |
| **.idea/** y **.vscode/**        | Configuración de los entornos de desarrollo (WebStorm/VSCode).                             |
| **README.md**                    | Documentación principal del proyecto.                                                      |

---

## Subcarpetas y Organización Modular

- **components/api/**  
  Configuración de la URL base de la API y funciones para interactuar con el backend.

- **components/nav/**  
  Componentes de navegación personalizados, como barras de navegación y menús laterales.

- **components/notification/**  
  Componentes para mostrar alertas, mensajes y notificaciones push.

- **components/sesion/**  
  Funciones para iniciar, mantener y cerrar sesión de usuario.

- **components/utils/**  
  Funciones auxiliares y utilidades generales para toda la app.

- **components/sin_uso/**  
  Componentes que no están en uso actualmente, pero pueden ser reutilizados o adaptados en el futuro.

- **hookes/**  
  Hooks personalizados para lógica de negocio, como manejo de asistencias, permisos y control de sesión.

- **pages/**  
  Cada subcarpeta representa una pantalla o módulo funcional de la app, facilitando la organización y el mantenimiento.

- **styles/**  
  Archivos de estilos independientes para cada pantalla o componente, promoviendo la reutilización y consistencia visual.

---

## Roles y Permisos

El sistema implementa control de acceso basado en roles, permitiendo definir permisos específicos para cada tipo de usuario (administrador, docente, estudiante, acudiente, personal de apoyo). Cada acción relevante está protegida por validaciones de sesión y permisos, garantizando la integridad y confidencialidad de la información.

---

## Instalación y Despliegue

**Requisitos Previos:**
- Node.js y npm instalados
- Expo CLI (`npm install -g expo-cli`)
- Acceso a un dispositivo móvil o emulador

**Pasos de Instalación:**
1. Clonar el repositorio:
   ```shell
   git clone <URL-del-repositorio>
   cd sami.app
   ```
2. Instalar dependencias:
   ```shell
   npm install
   ```
3. Iniciar la aplicación:
   ```shell
   npx expo start
   ```
4. Escanear el QR con la app Expo Go o ejecutar en un emulador.

---

## Buenas Prácticas y Seguridad

- Mantener actualizadas las dependencias.
- Proteger las credenciales y archivos sensibles.
- Validar roles y permisos en cada acción crítica.
- Realizar respaldos periódicos de la información.

---

## Licencia y Uso

Este software es propiedad exclusiva del Colegio Real Royal School. Queda estrictamente prohibido su uso, distribución, copia o modificación sin la autorización expresa y por escrito de la institución. El acceso y manipulación del código fuente está restringido al personal autorizado.

---

## Mantenimiento y Soporte

Para reportar incidencias, solicitar soporte o proponer mejoras, contactar directamente al área de sistemas del Colegio Real Royal School. Se recomienda documentar cualquier cambio relevante en el código y mantener actualizado el historial de versiones.
