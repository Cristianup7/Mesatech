# MesaTech Cloud - Plataforma Cloud-Native de Soporte Técnico

Solución full stack desarrollada para dar cumplimiento al **100% de los requerimientos** del caso de negocio **MesaTech Cloud**, integrando React, Microsoft Entra ID (Azure AD), AWS API Gateway, Backend for Frontend (BFF) y microservicios desacoplados con Spring Boot y MySQL sobre Amazon EC2 / Amazon RDS.

---

## Estructura del Repositorio

```
c:\WORKSPACE\Mesatech\
├── database/                          # Scripts de Persistencia Relacional MySQL
│   ├── 01_schema_solicitudes.sql      # DDL para base de datos de Solicitudes
│   ├── 02_schema_catalogo.sql         # DDL para base de datos de Catálogo
│   └── 03_seed_data.sql               # Semillas iniciales (Categorías, Prioridades, Tickets)
│
├── infrastructure/                    # Configuraciones de Infraestructura Cloud
│   ├── api-gateway/                   # AWS API Gateway (HTTP API + JWT Authorizer)
│   │   ├── aws-api-gateway-config.md  # Guía de configuración en AWS y comandos CLI
│   │   └── openapi-http-api.yaml      # Especificación OpenAPI 3.0 con extensiones AWS
│   ├── ec2/                           # Amazon EC2
│   │   ├── docker-compose.yml         # Orquestación multi-contenedor para EC2
│   │   └── setup-ec2.sh               # Script de aprovisionamiento de instancia
│   └── entra-id/                      # Microsoft Entra ID (Azure AD)
│       ├── api-cloud-native-manifest.json # Manifiesto para API con Roles y Scopes v2.0
│       ├── spa-react-manifest.json    # Manifiesto para SPA React con Redirect URIs
│       └── azure-entra-id-guide.md    # Guía detallada paso a paso de configuración
│
├── mesatech-bff/                      # Microservicio BFF (Puerto 8080)
│   ├── src/main/java/com/mesatech/bff/
│   │   ├── config/                    # SecurityConfig, JwtRoleConverter (RBAC)
│   │   ├── client/                    # SolicitudesClient, CatalogoClient (RestClient)
│   │   └── controller/                # Enrutadores /v1/solicitudes, /v2/solicitudes, /v1/catalogo
│   └── pom.xml
│
├── mesatech-solicitudes/              # Microservicio 1: Solicitudes (Puerto 8081)
│   ├── src/main/java/com/mesatech/solicitudes/
│   │   ├── model/                     # Solicitud, HistorialTransicion, EstadoSolicitud
│   │   ├── service/                   # Máquina de estados y regla crítica de RESUELTA
│   │   └── controller/                # SolicitudV1Controller y SolicitudV2Controller
│   └── pom.xml
│
├── mesatech-catalogo/                 # Microservicio 2: Catálogo (Puerto 8082)
│   ├── src/main/java/com/mesatech/catalogo/
│   │   ├── model/                     # Categoria, Prioridad (SLA)
│   │   └── controller/                # CRUD completo /v1/catalogo/categorias y prioridades
│   └── pom.xml
│
├── mesatech-frontend/                 # Frontend React SPA (Puerto 3000)
│   ├── src/
│   │   ├── auth/                      # Configuración MSAL (@azure/msal-react / browser)
│   │   ├── components/                # Navbar, TokenClaimsModal, StatusBadge, Stepper
│   │   ├── views/                     # UnauthenticatedHero, Cliente, Operador, Admin
│   │   └── services/                  # apiService (Axios con inyección de Bearer Token)
│   └── package.json
│
├── docs/                              # Documentación Académica y Técnica
│   ├── EP1_ARQUITECTURA_SOLUCION.md   # Especificación de arquitectura y diagramas Mermaid
│   ├── JUSTIFICACION_RDS_VS_EC2.md    # Justificación técnica y económica Amazon RDS vs EC2
│   ├── INFORME_EVIDENCIA_MESATECH.md  # Informe pormenorizado de configuraciones y evidencias
│   ├── MATRIZ_PRUEBAS_VERIFICACION.md # Matriz de pruebas obligatorias (401, 403, 200, 422)
│   └── GUIA_PRESENTACION_DOCENTE.md   # Guía de defensa oral y banco de preguntas de examen
│
└── scripts/
    └── verificar-escenarios.ps1       # Script PowerShell para automatizar pruebas HTTP
```

---

## Ejecución Rápida y Verificación Local

### 1. Compilación de Microservicios Backend (Java 25 / Maven)
```powershell
# Microservicio 1: Solicitudes (8081)
mvn clean test -f c:\WORKSPACE\Mesatech\mesatech-solicitudes\pom.xml

# Microservicio 2: Catálogo (8082)
mvn clean test -f c:\WORKSPACE\Mesatech\mesatech-catalogo\pom.xml

# Backend for Frontend (BFF) (8080)
mvn clean test -f c:\WORKSPACE\Mesatech\mesatech-bff\pom.xml
```

### 2. Construcción de Frontend React
```powershell
cd c:\WORKSPACE\Mesatech\mesatech-frontend
npm install
npm run build
npm start
```

### 3. Matriz de Pruebas de Control Obligatorias
Ejecutar el script de verificación automatizada:
```powershell
powershell -ExecutionPolicy Bypass -File c:\WORKSPACE\Mesatech\scripts\verificar-escenarios.ps1
```
