// Configuración de autenticación Microsoft Entra ID (Azure AD) usando MSAL
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "mesatech-spa-react-client-id",
    authority: process.env.REACT_APP_AZURE_AUTHORITY || `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || "common"}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage", // o "localStorage"
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) {
          console.log(`[MSAL] ${message}`);
        }
      },
      logLevel: 2, // Informational
    },
  },
};

// Scopes para el inicio de sesión inicial del usuario (permite autenticar sin requerir consentimiento previo de la API)
export const loginRequest = {
  scopes: ["openid", "profile", "email"]
};

// Scopes requeridos para invocar la API Cloud Native a través del API Gateway
export const tokenRequest = {
  scopes: [
    process.env.REACT_APP_API_SCOPE || "api://api-cloud-native/access_as_user"
  ]
};

// Roles reconocidos por la lógica de negocio de MesaTech Cloud
export const ROLES = {
  CLIENTE: "Cliente",
  OPERADOR: "Operador",
  ADMINISTRADOR: "Administrador"
};
