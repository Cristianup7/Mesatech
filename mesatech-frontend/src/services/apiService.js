import axios from "axios";
import { tokenRequest, loginRequest } from "../auth/authConfig";
import { mockRepo } from "./mockData";

// URL base de AWS API Gateway (o BFF directo en desarrollo)
export let API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

export const setApiBaseUrl = (newUrl) => {
  API_BASE_URL = newUrl;
  apiClient.defaults.baseURL = newUrl;
};

export const getApiBaseUrl = () => API_BASE_URL;

let globalMsalInstance = null;
let mockToken = null;
let activeRoleHeader = null;

export const setMsalInstance = (instance) => {
  globalMsalInstance = instance;
};

export const setMockToken = (token) => {
  mockToken = token;
};

export const setActiveRoleHeader = (role) => {
  activeRoleHeader = role;
};

// Interceptor para inyectar automáticamente el Bearer Access Token y X-Active-Role
apiClient.interceptors.request.use(
  async (config) => {
    if (activeRoleHeader) {
      config.headers["X-Active-Role"] = activeRoleHeader;
    }
    try {
      // 1. Si hay un mock token activo (modo demo offline docente), lo usamos
      if (mockToken) {
        config.headers.Authorization = `Bearer ${mockToken}`;
        return config;
      }

      // 2. Si hay sesión activa en MSAL, adquirimos el Access Token silenciosamente
      if (globalMsalInstance) {
        const accounts = globalMsalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const request = {
            ...tokenRequest,
            account: accounts[0]
          };
          try {
            const response = await globalMsalInstance.acquireTokenSilent(request);
            const tokenToUse = response.idToken || response.accessToken || accounts[0]?.idToken;
            if (tokenToUse) {
              config.headers.Authorization = `Bearer ${tokenToUse}`;
            }
          } catch (scopeErr) {
            // Fallback con loginRequest si el scope de API aún no fue aprobado
            const fallbackResponse = await globalMsalInstance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0]
            });
            const tokenToUse = fallbackResponse.idToken || fallbackResponse.accessToken || accounts[0]?.idToken;
            if (tokenToUse) {
              config.headers.Authorization = `Bearer ${tokenToUse}`;
            }
          }
        }
      }
    } catch (error) {
      console.warn("No se pudo adquirir el token silenciosamente:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Servicios de Solicitudes ---
export const ticketService = {
  listarV1: async (params) => {
    try {
      return await apiClient.get("/v1/solicitudes", { params });
    } catch (err) {
      console.warn("Backend no disponible temporalmente, cargando datos semilla de prueba:", err.message);
      return { data: mockRepo.getTickets(params, "v1") };
    }
  },

  listarV2: async (params) => {
    try {
      return await apiClient.get("/v2/solicitudes", { params });
    } catch (err) {
      console.warn("Backend no disponible temporalmente, cargando datos semilla de prueba v2:", err.message);
      return { data: mockRepo.getTickets(params, "v2") };
    }
  },

  obtenerPorIdV1: async (id) => {
    try {
      return await apiClient.get(`/v1/solicitudes/${id}`);
    } catch (err) {
      return { data: mockRepo.getTicketById(id) };
    }
  },

  obtenerPorIdV2: async (id) => {
    try {
      return await apiClient.get(`/v2/solicitudes/${id}`);
    } catch (err) {
      return { data: mockRepo.getTicketById(id) };
    }
  },

  crear: async (data) => {
    try {
      return await apiClient.post("/v1/solicitudes", data);
    } catch (err) {
      return { data: mockRepo.createTicket(data) };
    }
  },

  cambiarEstado: async (id, data) => {
    try {
      return await apiClient.put(`/v1/solicitudes/${id}/estado`, data);
    } catch (err) {
      // Si fue rechazo 422 por regla de negocio, propagarlo
      if (err.response && err.response.status === 422) {
        throw err;
      }
      return { data: mockRepo.changeTicketState(id, data) };
    }
  },

  asignarOperador: async (id, data) => {
    try {
      return await apiClient.put(`/v1/solicitudes/${id}/asignar`, data);
    } catch (err) {
      return { data: mockRepo.assignTicket(id, data) };
    }
  }
};

// --- Servicios de Catálogo ---
export const catalogService = {
  listarCategorias: async (soloActivas = false) => {
    try {
      return await apiClient.get("/v1/catalogo/categorias", { params: { soloActivas } });
    } catch (err) {
      return { data: mockRepo.getCategories(soloActivas) };
    }
  },

  crearCategoria: async (data) => {
    try {
      return await apiClient.post("/v1/catalogo/categorias", data);
    } catch (err) {
      return { data: mockRepo.createCategory(data) };
    }
  },

  actualizarCategoria: async (id, data) => {
    try {
      return await apiClient.put(`/v1/catalogo/categorias/${id}`, data);
    } catch (err) {
      return { data: mockRepo.updateCategory(id, data) };
    }
  },

  eliminarCategoria: async (id) => {
    try {
      return await apiClient.delete(`/v1/catalogo/categorias/${id}`);
    } catch (err) {
      return { data: mockRepo.deleteCategory(id) };
    }
  },

  listarPrioridades: async (soloActivas = false) => {
    try {
      return await apiClient.get("/v1/catalogo/prioridades", { params: { soloActivas } });
    } catch (err) {
      return { data: mockRepo.getPriorities(soloActivas) };
    }
  },

  crearPrioridad: async (data) => {
    try {
      return await apiClient.post("/v1/catalogo/prioridades", data);
    } catch (err) {
      return { data: mockRepo.createPriority(data) };
    }
  },

  actualizarPrioridad: async (id, data) => {
    try {
      return await apiClient.put(`/v1/catalogo/prioridades/${id}`, data);
    } catch (err) {
      return { data: mockRepo.updatePriority(id, data) };
    }
  },

  eliminarPrioridad: async (id) => {
    try {
      return await apiClient.delete(`/v1/catalogo/prioridades/${id}`);
    } catch (err) {
      return { data: mockRepo.deletePriority(id) };
    }
  }
};

// --- Servicio de Inspección de Token / Perfil ---
export const authService = {
  obtenerPerfilActual: () => apiClient.get("/api/auth/me")
};

export default apiClient;
