# Guía y Estrategia de Presentación para Evaluación Docente

**Proyecto:** MesaTech Cloud - Plataforma de Soporte Técnico Cloud-Native  
**Objetivo de la Guía:** Preparar al estudiante para la exposición oral y responder con precisión y solidez técnica a las preguntas del docente evaluador, obteniendo la calificación máxima sin depender de una demostración en vivo (a menos que sea solicitada expresamente).

---

## 1. Estructura de la Presentación Oral (Diapositiva por Diapositiva)

### Diapositiva 1: Portada y Contexto del Negocio
- **Título:** MesaTech Cloud: Arquitectura Cloud-Native Segura e Integrada
- **Mensaje Clave:** Implementación de una plataforma corporativa de mesa de ayuda bajo el patrón Backend for Frontend (BFF) y microservicios, asegurada mediante federación de identidades con Microsoft Entra ID y borde en AWS API Gateway.

### Diapositiva 2: Diagrama de Arquitectura de la Solución
- **Mostrar:** Diagrama de bloques (Cliente React -> Azure Entra ID -> AWS API Gateway -> EC2 BFF -> Microservicios -> MySQL).
- **Argumento:**
  - Desacoplamiento entre la capa de presentación (SPA) y la lógica de negocio.
  - API Gateway como **punto único de entrada**, protegiendo la red interna y descargando la validación criptográfica del JWT.
  - El **BFF actúa como portero y enrutador**, aplicando autorización por rol (RBAC) sin tocar la base de datos.

### Diapositiva 3: Identidad y Seguridad en Microsoft Entra ID (Azure AD)
- **Mostrar:** Capturas del portal Azure con las dos App Registrations (`mesatech-spa-react` y `api-cloud-native`).
- **Puntos a destacar:**
  - Token versión 2.0 (`accessTokenAcceptedVersion: 2`).
  - Scopes delegados: `api://api-cloud-native/access_as_user`.
  - App Roles definidos en el manifiesto: `Cliente`, `Operador`, `Administrador`.
  - Usuarios creados y asignados en Enterprise Applications.

### Diapositiva 4: AWS API Gateway (HTTP API) y JWT Authorizer
- **Mostrar:** Capturas de la consola de AWS API Gateway:
  - Configuración del **JWT Authorizer** (`Issuer: https://login.microsoftonline.com/.../v2.0` y `Audience: api://api-cloud-native`).
  - Integración HTTP Proxy hacia la instancia EC2 (`http://<EC2-IP>:8080/{proxy}`).
  - Políticas de **CORS** con orígenes permitidos (`http://localhost:3000`), cabeceras (`Authorization, Content-Type`) y métodos HTTP.

### Diapositiva 5: Backend en Spring Boot y Persistencia en AWS
- **Mostrar:** Estructura de los 3 microservicios Java 25:
  - **BFF (8080):** Spring Security OAuth2 Resource Server con `JwtRoleConverter`. Sin dependencias JDBC.
  - **Solicitudes (8081):** Máquina de estados con validación de regla crítica y versionamiento activo (`/v1/solicitudes` y `/v2/solicitudes`).
  - **Catálogo (8082):** CRUD de Categorías y Prioridades de soporte.
- **Justificación RDS vs EC2:** Amazon RDS provee alta disponibilidad (Multi-AZ), backups continuos con Point-in-Time Recovery y automatización de parches, liberando al equipo de tareas operativas.

### Diapositiva 6: Frontend en React (MSAL y Experiencia por Rol)
- **Mostrar:** Capturas de pantalla de la interfaz de usuario:
  - **Vista No Autenticado:** Landing corporativa con botón de acceso y descripción de arquitectura.
  - **Inspector de Claims:** Modal desplegado mostrando los campos `sub`, `roles`, `aud`, `iss` y `exp` del JWT.
  - **Dashboard Cliente:** Formulario de registro y seguimiento con stepper.
  - **Dashboard Operador:** Consola de transiciones y botón para probar la regla de negocio.
  - **Dashboard Administrador:** Mantenedor de categorías y prioridades con switch para comparar la API v1 vs API v2.

### Diapositiva 7: Resultados de la Matriz de Pruebas de Control
- **Mostrar:** Tabla de evidencias con los escenarios obligatorios:
  - Sin token -> 401 Unauthorized.
  - Token alterado -> 401 Unauthorized.
  - Cliente intentando modificar catálogo -> 403 Forbidden.
  - CORS Preflight -> 200 OK.
  - Salto de estado ilegal (`CREADA` -> `RESUELTA`) -> 422 Unprocessable Entity.

---

## 2. Banco de Preguntas Típicas del Docente y Respuestas Modelo

### P1: ¿Cuál es la diferencia exacta entre Autenticación y Autorización en este proyecto y qué componente realiza cada una?
> **Respuesta Modelo:**
> "La **Autenticación** es el proceso de verificar la identidad del usuario (*¿quién eres?*). En nuestro sistema, la realiza **Microsoft Entra ID**, quien solicita las credenciales y emite un token JWT firmado. Posteriormente, el **JWT Authorizer de AWS API Gateway** comprueba que ese token sea auténtico y válido en tiempo y emisor.
> La **Autorización** es el proceso de determinar qué permisos y acciones tiene permitidas ese usuario ya autenticado (*¿qué puedes hacer?*). En nuestra arquitectura, la autorización por roles la realiza el **BFF en Spring Boot**, leyendo el claim `roles` (`Cliente`, `Operador`, `Administrador`) y denegando con código 403 Forbidden cualquier operación no autorizada antes de tocar los microservicios de negocio."

---

### P2: ¿Por qué se definió que el BFF no puede conectarse directamente a la base de datos?
> **Respuesta Modelo:**
> "Porque el patrón arquitectónico BFF (Backend for Frontend) tiene como única responsabilidad actuar como adaptador, orquestador y capa de seguridad perimetral para la interfaz de usuario. Si el BFF se conectara directamente a la base de datos, rompería el aislamiento y desacoplamiento de los microservicios, duplicaría la lógica de negocio y generaría dependencia de persistencia en una capa que debe ser liviana y stateless. Los microservicios de dominio (Solicitudes y Catálogo) son los únicos dueños (*Single Source of Truth*) de sus datos."

---

### P3: ¿Qué ventaja ofrece tener un JWT Authorizer en AWS API Gateway si el BFF también valida el token?
> **Respuesta Modelo:**
> "Aplica el principio de **Defensa en Profundidad** (*Defense in Depth*) y optimización de recursos:
> 1. **Filtrado en el Borde (Edge Security):** Cualquier petición no autenticada, maliciosa o con token expirado es descartada en AWS API Gateway sin consumir CPU, memoria ni ancho de banda de nuestra instancia EC2.
> 2. **Prevención de Ataques DoS:** Protege al backend de saturación por peticiones anónimas.
> 3. El BFF en EC2 realiza la segunda validación especializada: comprobar la vigencia y aplicar el control de acceso granular por rol (RBAC)."

---

### P4: ¿Por qué era necesario asegurar que el token se emitiera en versión 2.0 (`accessTokenAcceptedVersion: 2`)?
> **Respuesta Modelo:**
> "Porque los tokens v1.0 de Azure AD utilizan un formato propietario antiguo donde el issuer y la estructura de claims difieren y no cumplen estrictamente el estándar moderno de OpenID Connect. Al establecer `accessTokenAcceptedVersion: 2`, garantizamos compatibilidad nativa con las especificaciones RFC 7519 y con el validador estándar de AWS API Gateway y Spring Security, asegurando que el claim `iss` coincida exactamente con `https://login.microsoftonline.com/<tenant>/v2.0` y que los roles se serialicen de forma consistente en el array `roles`."

---

### P5: ¿Cómo funciona CORS y por qué el navegador lanza peticiones OPTIONS antes de enviar un POST o PUT?
> **Respuesta Modelo:**
> "CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad implementado por los navegadores web para evitar que un sitio malicioso haga peticiones no autorizadas hacia otro dominio. Como la SPA corre en un origen distinto (ej. `http://localhost:3000`) al API Gateway (dominio de AWS), el navegador envía una petición preliminar de sondeo (*Preflight request*) con método `OPTIONS`. API Gateway responde a ese preflight informando los métodos, cabeceras y orígenes permitidos mediante `Access-Control-Allow-*`. Solo cuando el navegador recibe un 200 OK con las cabeceras válidas, procede a emitir la petición real (`POST` o `PUT`)."

---

### P6: ¿Cómo se programó y comprobó la regla de negocio de que una solicitud no pase a RESUELTA sin pasar por EN_PROCESO?
> **Respuesta Modelo:**
> "En la entidad `Solicitud` del microservicio 1 creamos la bandera booleana `tuvoEnProceso`. Cuando la solicitud transiciona legítimamente a `EN_PROCESO`, marcamos esa bandera en `true` y persistimos el evento en la tabla `historial_transiciones`.
> En el servicio `SolicitudService.validarTransicion()`, si el nuevo estado solicitado es `RESUELTA`, el código verifica que `solicitud.isTuvoEnProceso()` sea verdadero y que el estado actual sea `EN_PROCESO`. Si un operador o cliente intenta saltar de `CREADA` o `ASIGNADA` directamente a `RESUELTA`, se lanza una excepción `BusinessRuleException`, la cual es interceptada por el `@RestControllerAdvice` devolviendo un código HTTP 422 con un mensaje explicativo. Esta regla cuenta con pruebas unitarias automatizadas en JUnit 5."

---

### P7: ¿Cómo conviven y qué diferencia existe entre la API versión 1 y la versión 2?
> **Respuesta Modelo:**
> "Diseñamos rutas explícitas en los controladores de Spring Boot y en API Gateway:
> - `/v1/solicitudes`: Expone el modelo clásico con los campos esenciales del ticket.
> - `/v2/solicitudes`: Expone un DTO enriquecido que calcula en tiempo real el cumplimiento del SLA (horas máximas según prioridad, minutos transcurridos y etiqueta de estado: `DENTRO_DE_PLAZO`, `EN_RIESGO` o `VENCIDO`), la lista de siguientes estados válidos y la traza histórica completa de auditoría.
> Ambas versiones están activas simultáneamente en el mismo backend, permitiendo a clientes legados seguir usando v1 mientras clientes modernos aprovechan las capacidades de v2."
