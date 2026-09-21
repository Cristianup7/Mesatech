# Matriz de Verificación de Pruebas Obligatorias - MesaTech Cloud

Este documento certifica y documenta la ejecución de los escenarios de control exigidos en la evaluación para **MesaTech Cloud**, detallando el comportamiento esperado y el resultado verificado en los componentes de seguridad (**AWS API Gateway**, **BFF Spring Boot** y microservicios internos).

---

## 1. Resumen Ejecutivo de Pruebas

| ID | Escenario de Control | Componente Validador | Petición HTTP | Código Esperado | Resultado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | Acceso sin autenticación / sin token | AWS API Gateway (JWT Authorizer) & BFF | `GET /v1/solicitudes` (Sin header Authorization) | **401 Unauthorized** | **PASÓ (APROBADO)** |
| **CP-02** | Token JWT inválido, adulterado o expirado | AWS API Gateway & BFF | `GET /v1/solicitudes` (`Authorization: Bearer <token_invalido>`) | **401 Unauthorized** | **PASÓ (APROBADO)** |
| **CP-03** | Acción denegada por Rol (Cliente intentando modificar catálogo) | BFF (`SecurityConfig` / RBAC) | `POST /v1/catalogo/categorias` (Token con rol `Cliente`) | **403 Forbidden** | **PASÓ (APROBADO)** |
| **CP-04** | Acción denegada por Rol (Cliente intentando cambiar estado de ticket) | BFF (`SecurityConfig` / RBAC) | `PUT /v1/solicitudes/1/estado` (Token con rol `Cliente`) | **403 Forbidden** | **PASÓ (APROBADO)** |
| **CP-05** | Consumo vía CORS desde navegador (Preflight) | AWS API Gateway & BFF CORS Filter | `OPTIONS /v1/solicitudes` (`Origin: http://localhost:3000`) | **200 OK** (con cabeceras CORS) | **PASÓ (APROBADO)** |
| **CP-06** | Regla Crítica: Salto de estado ilegal (`CREADA` -> `RESUELTA`) | Microservicio 1 (`SolicitudService`) | `PUT /v1/solicitudes/{id}/estado` (nuevoEstado: `RESUELTA` sin `EN_PROCESO`) | **422 Unprocessable Entity / 400 Bad Request** | **PASÓ (APROBADO)** |
| **CP-07** | Coexistencia de versiones API (v1 y v2) | Microservicio 1 & BFF | `GET /v1/solicitudes` y `GET /v2/solicitudes` | **200 OK** (ambos activos) | **PASÓ (APROBADO)** |

---

## 2. Detalle de Ejecución y Evidencia Técnica

### CP-01: Acceso sin autenticación ni token
- **Descripción:** Se intenta realizar una consulta a los endpoints de la API sin proveer la cabecera `Authorization`.
- **Comando de prueba:**
  ```bash
  curl -i -X GET http://localhost:8080/v1/solicitudes
  ```
- **Respuesta obtenida:**
  ```http
  HTTP/1.1 401 Unauthorized
  WWW-Authenticate: Bearer
  Content-Type: application/json
  
  {
    "status": 401,
    "error": "No Autorizado (401 Unauthorized)",
    "message": "Token JWT inválido, expirado o ausente."
  }
  ```
- **Conclusión:** El sistema bloquea inmediatamente la petición no autenticada.

---

### CP-02: Acceso con token inválido o expirado
- **Descripción:** Se envía un token con firma alterada o con tiempo de expiración vencido (`exp`).
- **Comando de prueba:**
  ```bash
  curl -i -X GET http://localhost:8080/v1/solicitudes \
    -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSIsImV4cCI6MTUxNjIzOTAyMn0.invalid_signature"
  ```
- **Respuesta obtenida:**
  ```http
  HTTP/1.1 401 Unauthorized
  WWW-Authenticate: Bearer error="invalid_token", error_description="An error occurred while attempting to decode the Jwt: Signed JWT rejected: Invalid signature"
  ```
- **Conclusión:** API Gateway y Spring Security rechazan firmas criptográficas que no coincidan con las claves públicas de Microsoft Entra ID.

---

### CP-03: Control de Acceso por Rol (Cliente en Catálogo)
- **Descripción:** Un usuario válidamente autenticado en Entra ID pero que ostenta el rol `Cliente` intenta realizar una operación administrativa sobre el catálogo (`POST /v1/catalogo/categorias`).
- **Comando de prueba:**
  ```bash
  curl -i -X POST http://localhost:8080/v1/catalogo/categorias \
    -H "Authorization: Bearer <JWT_ROL_CLIENTE>" \
    -H "Content-Type: application/json" \
    -d '{"codigo":"NUEVA","nombre":"Categoría no autorizada"}'
  ```
- **Respuesta obtenida:**
  ```http
  HTTP/1.1 403 Forbidden
  Content-Type: application/json
  
  {
    "status": 403,
    "error": "Acceso Denegado (403 Forbidden)",
    "message": "No posee los roles o permisos necesarios para ejecutar esta acción en MesaTech Cloud."
  }
  ```
- **Conclusión:** El BFF intercepta el claim `roles`, comprueba que no contiene `ROLE_Administrador` y deniega el acceso con 403 Forbidden antes de reenviar la petición al microservicio 2.

---

### CP-05: Validación de Políticas CORS
- **Descripción:** El navegador web emite una petición de sondeo previo (`OPTIONS` Preflight) con la cabecera `Origin` correspondiente al frontend de React (`http://localhost:3000`).
- **Comando de prueba:**
  ```bash
  curl -i -X OPTIONS http://localhost:8080/v1/solicitudes \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: authorization,content-type"
  ```
- **Respuesta obtenida:**
  ```http
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD
  Access-Control-Allow-Headers: authorization, content-type
  Access-Control-Allow-Credentials: true
  ```
- **Conclusión:** Las cabeceras CORS son devueltas con éxito, evitando bloqueos de origen cruzado en el navegador.

---

### CP-06: Validación de Regla de Negocio Crítica de Estados
- **Descripción:** Se intenta cambiar el estado de una solicitud desde `CREADA` directamente a `RESUELTA`, omitiendo el paso por `EN_PROCESO`.
- **Comando de prueba:**
  ```bash
  curl -i -X PUT http://localhost:8081/v1/solicitudes/1/estado \
    -H "Content-Type: application/json" \
    -d '{"nuevoEstado":"RESUELTA","usuario":"operador@mesatech.cloud"}'
  ```
- **Respuesta obtenida:**
  ```http
  HTTP/1.1 422 Unprocessable Entity
  Content-Type: application/json
  
  {
    "status": 422,
    "error": "Regla de Negocio Incumplida",
    "message": "Regla de negocio infringida: Una solicitud no puede pasar a estado RESUELTA si antes no pasó por EN_PROCESO."
  }
  ```
- **Conclusión:** La máquina de estados impide transiciones inválidas y garantiza la trazabilidad operativa del soporte técnico.
