# Guía de Configuración: Microsoft Entra ID (Azure AD) para MesaTech Cloud

Esta guía documenta la configuración del proveedor de identidad en Microsoft Entra ID requerida para el caso de negocio MesaTech Cloud.

---

## 1. Registro de la Aplicación API: `api-cloud-native`

1. Iniciar sesión en el portal de Azure: [portal.azure.com](https://portal.azure.com).
2. Dirigirse a **Microsoft Entra ID** > **App registrations** (Registros de aplicaciones) > **New registration** (Nuevo registro).
3. Configurar:
   - **Nombre:** `api-cloud-native`
   - **Supported account types:** *Accounts in this organizational directory only (Single tenant)*
4. Hacer clic en **Register** (Registrar).
5. **Configurar App ID URI:**
   - Ir a **Expose an API** (Exponer una API).
   - En *Application ID URI*, hacer clic en **Set** y definir: `api://api-cloud-native` (o aceptar `api://<app-id>`).
6. **Agregar Scope (Ámbito):**
   - Hacer clic en **Add a scope**.
   - **Scope name:** `access_as_user`
   - **Who can consent:** *Admins and users*
   - **Admin consent display name:** `Acceso como usuario a MesaTech API`
   - **Admin consent description:** `Permite a la aplicación acceder a la API de MesaTech Cloud en nombre del usuario autenticado.`
   - **State:** *Enabled*
   - Guardar cambios.
7. **Crear App Roles (Roles de Aplicación):**
   - Ir a **App roles** > **Create app role**.
   - **Rol 1 (Cliente):**
     - Display name: `Cliente`
     - Allowed member types: `Users/Groups`
     - Value: `Cliente`
     - Description: `Usuario solicitante de tickets de soporte técnico.`
   - **Rol 2 (Operador):**
     - Display name: `Operador`
     - Allowed member types: `Users/Groups`
     - Value: `Operador`
     - Description: `Técnico encargado de gestionar y transicionar estados de solicitudes.`
   - **Rol 3 (Administrador):**
     - Display name: `Administrador`
     - Allowed member types: `Users/Groups`
     - Value: `Administrador`
     - Description: `Administrador global del catálogo y todas las solicitudes.`
8. **Validar Manifiesto (Token v2.0):**
   - Ir a **Manifest**.
   - Verificar que `"accessTokenAcceptedVersion": 2`. Si está en `null` o `1`, cambiarlo a `2` y guardar.

---

## 2. Registro de la Aplicación SPA: `mesatech-spa-react`

1. En **Microsoft Entra ID** > **App registrations** > **New registration**.
2. Configurar:
   - **Nombre:** `mesatech-spa-react`
   - **Supported account types:** *Accounts in this organizational directory only (Single tenant)*
   - **Redirect URI:** Seleccionar plataforma **Single-page application (SPA)** y colocar:
     - `http://localhost:3000`
3. Hacer clic en **Register**.
4. En la vista general de la aplicación, ir a **Authentication**:
   - Agregar URI adicional: `http://localhost:3000/blank.html` (para silent token renewal).
   - Marcar si aplica: *ID tokens (used for implicit and hybrid flows)*.
5. **Permisos de API (API permissions):**
   - Ir a **API permissions** > **Add a permission** > **My APIs**.
   - Seleccionar `api-cloud-native`.
   - Elegir **Delegated permissions** y marcar `access_as_user`.
   - Hacer clic en **Add permissions**.
   - Presionar **Grant admin consent for <Tu-Tenant>** para autorizar los permisos de inmediato.

---

## 3. Creación de Usuarios y Asignación de Roles

1. Ir a **Microsoft Entra ID** > **Users** > **New user** > **Create new user**:
   - **Usuario 1 (Cliente):** `cliente@tu-dominio.onmicrosoft.com` / Nombre: `Carlos Cliente`
   - **Usuario 2 (Operador):** `operador@tu-dominio.onmicrosoft.com` / Nombre: `Olga Operador`
   - **Usuario 3 (Administrador):** `admin@tu-dominio.onmicrosoft.com` / Nombre: `Andrés Administrador`
2. **Asignar Roles a los Usuarios:**
   - Ir a **Microsoft Entra ID** > **Enterprise applications** (Aplicaciones empresariales).
   - Buscar y seleccionar `api-cloud-native`.
   - Ir a **Users and groups** > **Add user/group**.
   - Seleccionar a `Carlos Cliente` y asignarle el rol **Cliente**.
   - Seleccionar a `Olga Operador` y asignarle el rol **Operador**.
   - Seleccionar a `Andrés Administrador` y asignarle el rol **Administrador**.

---

## 4. Estructura del Token JWT Emitido (v2.0)

Cuando el usuario inicia sesión mediante MSAL en la SPA, Entra ID genera un JWT con la siguiente estructura de claims relevantes:

```json
{
  "aud": "api://api-cloud-native",
  "iss": "https://login.microsoftonline.com/<TENANT_ID>/v2.0",
  "iat": 1726880000,
  "nbf": 1726880000,
  "exp": 1726883600,
  "sub": "b2685794-6d97-400a-b31c-7f5209774677",
  "name": "Carlos Cliente",
  "preferred_username": "cliente@tu-dominio.onmicrosoft.com",
  "roles": [
    "Cliente"
  ],
  "scp": "access_as_user",
  "ver": "2.0"
}
```

Estos claims son verificados en primer lugar por el **JWT Authorizer de AWS API Gateway**, y posteriormente inspeccionados y autorizados a nivel de rol por el **BFF en Spring Boot**.
