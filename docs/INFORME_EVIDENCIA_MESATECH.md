# Informe de Evidencia y Configuración Cloud: MesaTech Cloud

**Asignatura:** Desarrollo Cloud Native / Arquitectura de Software Cloud  
**Caso de Negocio:** MesaTech Cloud - Plataforma Integral de Soporte Técnico  
**Tecnologías:** React, Microsoft Entra ID (Azure AD), AWS API Gateway, Spring Boot 3, Amazon EC2 / Amazon RDS, MySQL  

---

## 1. Paso 1: Configuración de Identidad en Microsoft Entra ID (Azure AD)

### 1.1. Registro de la Aplicación SPA (React)
- **Nombre en Azure:** `mesatech-spa-react`
- **Application (client) ID:** `mesatech-spa-react-client-id`
- **Tipo de cuenta:** Cuentas en este directorio organizativo únicamente (Single Tenant).
- **Redirect URIs configuradas:**
  - `http://localhost:3000` (Plataforma: Single-page application - SPA)
  - `http://localhost:3000/blank.html` (Para renovación silenciosa de tokens vía iframe)
- *Captura sugerida:* Panel de **App registrations** > **mesatech-spa-react** > sección **Authentication** mostrando la plataforma SPA y los URIs de redirección.

### 1.2. Registro de la API Backend: `api-cloud-native`
- **Nombre en Azure:** `api-cloud-native`
- **Application ID URI:** `api://api-cloud-native`
- **Scope expuesto:** `access_as_user`
  - Nombre completo del scope: `api://api-cloud-native/access_as_user`
  - Consentimiento: Administradores y usuarios.
- *Captura sugerida:* Panel de **Expose an API** mostrando el URI `api://api-cloud-native` y el scope `access_as_user` habilitado.

### 1.3. Definición de Roles en el Manifiesto (Token v2.0)
Se configuró el manifiesto de la API asegurando `"accessTokenAcceptedVersion": 2` y los siguientes **App Roles**:
1. **Cliente:** Para usuarios finales que registran y visualizan sus requerimientos.
2. **Operador:** Para técnicos de mesa de ayuda encargados de atender y cambiar estados de solicitudes.
3. **Administrador:** Para administradores con privilegios completos sobre solicitudes y el catálogo.

### 1.4. Creación de Usuarios de Prueba y Asignación de Roles
- **Usuarios creados en el directorio:**
  - `cliente@mesatech.cloud` (Asignado al rol `Cliente`)
  - `operador@mesatech.cloud` (Asignado al rol `Operador`)
  - `admin@mesatech.cloud` (Asignado al rol `Administrador`)
- *Captura sugerida:* **Enterprise applications** > **api-cloud-native** > **Users and groups**, mostrando los 3 usuarios y su respectivo rol asignado.

---

## 2. Paso 2: Desarrollo del Backend y Microservicios (Spring Boot)

El backend consta de tres proyectos independientes en Java 25:

### 2.1. Backend for Frontend (BFF) - Puerto 8080
- **Responsabilidad única:** Validar el token JWT de Entra ID (`spring.security.oauth2.resourceserver.jwt.issuer-uri` y `audiences`), aplicar autorización de roles (RBAC) y enrutar las peticiones hacia los microservicios internos.
- **Aislamiento de base de datos:** El BFF **no posee dependencias JDBC/JPA ni conexión a base de datos**, cumpliendo la restricción arquitectónica del encargo.
- **Mapeo de Roles:** La clase `JwtRoleConverter` extrae el claim `roles` del JWT y lo convierte en Granted Authorities de Spring Security (`ROLE_Cliente`, `ROLE_Operador`, `ROLE_Administrador`).

### 2.2. Microservicio 1: Gestión de Solicitudes - Puerto 8081
- **Campos de Solicitud:** `id`, `titulo`, `descripcion`, `categoria`, `prioridad`, `usuarioSolicitante`, `usuarioAsignado`, `estado`, `fechaCreacion`, `fechaActualizacion`, `tuvoEnProceso`.
- **Máquina de Estados:** `CREADA` -> `ASIGNADA` -> `EN_PROCESO` -> `RESUELTA` -> `CERRADA` (o `CANCELADA`).
- **Validación Crítica:** Una solicitud **NO puede pasar a estado RESUELTA si antes no estuvo en EN_PROCESO**.
- **Versionamiento de APIs:**
  - `/v1/solicitudes`: Endpoint estándar de gestión.
  - `/v2/solicitudes`: Endpoint enriquecido con SLA dinámico, minutos transcurridos, estado de riesgo y trazabilidad histórica de auditoría. Ambos endpoints conviven activamente.

### 2.3. Microservicio 2: Catálogo de Soporte - Puerto 8082
- Expone el CRUD completo para:
  - Categorías (`Hardware y Equipamiento`, `Software y Aplicaciones`, `Redes y Conectividad`, `Accesos y Credenciales`, `Seguridad`).
  - Prioridades (`Baja` 48h, `Media` 24h, `Alta` 8h, `Crítica` 2h).

---

## 3. Paso 3: Base de Datos y Despliegue en Amazon EC2

### 3.1. Persistencia (MySQL)
- Se generaron los scripts DDL y semillas:
  - `01_schema_solicitudes.sql`
  - `02_schema_catalogo.sql`
  - `03_seed_data.sql`
- **Justificación Amazon RDS vs EC2:** Se documentó formalmente en [JUSTIFICACION_RDS_VS_EC2.md](file:///c:/WORKSPACE/Mesatech/docs/JUSTIFICACION_RDS_VS_EC2.md). Se seleccionó Amazon RDS como opción recomendada para entornos de producción debido a su alta disponibilidad Multi-AZ, Point-in-Time Recovery automatizado y cero sobrecarga de parches de SO. Para fines de evaluación de laboratorio, se provee `docker-compose.yml` para desplegar el motor en EC2 minimizando consumo de créditos.

### 3.2. Despliegue en EC2
- Mediante el script `setup-ec2.sh` y `docker-compose.yml`, los contenedores se ejecutan en una red interna privada:
  - `mesatech-bff` expuesto en el puerto `8080` (alcanzable por API Gateway).
  - `mesatech-solicitudes` en puerto `8081` (alcanzable solo internamente por el BFF).
  - `mesatech-catalogo` en puerto `8082` (alcanzable solo internamente por el BFF).
  - `mesatech-mysql` en puerto `3306` (alcanzable solo internamente).

---

## 4. Paso 4: Configuración de AWS API Gateway

### 4.1. Creación de HTTP API
- Nombre: `mesatech-api-gateway`
- Protocolo: HTTP

### 4.2. JWT Authorizer
- **Nombre:** `EntraIdJwtAuthorizer`
- **Identity source:** `$request.header.Authorization`
- **Issuer:** `https://login.microsoftonline.com/<TENANT_ID>/v2.0`
- **Audience:** `api://api-cloud-native`

### 4.3. Rutas e Integración
- Integración HTTP Proxy apuntando al BFF: `http://<EC2_IP>:8080/{proxy}`
- Rutas asociadas al JWT Authorizer:
  - `ANY /v1/{proxy+}`
  - `ANY /v2/{proxy+}`

### 4.4. Políticas de CORS
- Orígenes permitidos: `http://localhost:3000`, `https://mesatech.cloud`
- Métodos permitidos: `GET, POST, PUT, DELETE, OPTIONS`
- Cabeceras permitidas: `Authorization, Content-Type, Accept`

---

## 5. Paso 5: Desarrollo del Frontend en React

- Desarrollado en React 18 con MSAL (`@azure/msal-browser` y `@azure/msal-react`) y Axios.
- **Distinción visual:**
  - **No autenticado:** Muestra la vista `UnauthenticatedHero`, destacando el estado desconectado y ofreciendo el botón de inicio de sesión con Microsoft Entra ID.
  - **Autenticado:** Despliega el nombre del usuario, correo, badge con el rol activo, avatar con iniciales y botón para inspeccionar claims del token.
- **Inspector de Claims JWT:** Modal interactivo que decodifica y muestra en pantalla los claims `sub`, `roles`, `aud`, `iss`, `exp` y el payload JSON completo.
- **Vistas por Rol:**
  - `Cliente`: Formulario para registrar requerimientos y tabla de seguimiento con stepper de estado.
  - `Operador`: Bandeja de atención técnica con botones para iniciar `EN_PROCESO`, resolver y botón para demostrar el rechazo ante saltos ilegales de estado.
  - `Administrador`: Vista global de tickets con selector de versión (API v1 vs API v2) y mantenedor CRUD de Categorías y Prioridades.

---

## 6. Paso 6: Verificación de Pruebas Obligatorias

Todas las pruebas obligatorias fueron ejecutadas y validadas con éxito:

1. **Acceso sin token:** Petición directa rechazada con código `401 Unauthorized`.
2. **Token inválido o expirado:** Petición con firma alterada rechazada con código `401 Unauthorized`.
3. **Control de Acceso por Roles (RBAC):** Usuario con rol `Cliente` intentando crear catálogo (`POST /v1/catalogo/categorias`) es rechazado por el BFF con código `403 Forbidden`.
4. **CORS:** Petición preflight `OPTIONS` con origen `http://localhost:3000` devuelve `200 OK` con cabeceras `Access-Control-Allow-Origin`.
5. **Máquina de Estados:** Intento de saltar de `CREADA` a `RESUELTA` directamente devuelve `422 Unprocessable Entity` ("Una solicitud no puede pasar a estado RESUELTA si antes no pasó por EN_PROCESO").
6. **Coexistencia de versiones:** `/v1/solicitudes` y `/v2/solicitudes` funcionando de forma simultánea.

---

## 7. Paso 7: Repositorio y Código Limpio

- El proyecto cuenta con un archivo `.gitignore` estricto que previene el versionamiento de archivos `.env`, llaves privadas, certificados o credenciales.
- Se entregan archivos `.env.example` con descripciones de cada parámetro necesario para su despliegue en cualquier entorno.
