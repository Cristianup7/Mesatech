// ==========================================================
// MesaTech Cloud - Datos Semilla y Mock Repository
// Cuentas de Prueba:
//   - Juan Cliente: cliente.prueba@curzua1.onmicrosoft.com
//   - Carlos Operador: operador.prueba@curzua1.onmicrosoft.com
//   - Andrés Administrador: admin.prueba@curzua1.onmicrosoft.com
// ==========================================================

export let mockCategories = [
  {
    id: 1,
    codigo: "HW",
    nombre: "Hardware y Equipamiento",
    descripcion: "Fallas en laptops, monitores, periféricos y partes físicas",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 2,
    codigo: "SW",
    nombre: "Software y Aplicaciones",
    descripcion: "Problemas con sistemas operativos, suites ofimáticas y software corporativo",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 3,
    codigo: "NET",
    nombre: "Redes y Conectividad",
    descripcion: "Dificultades de acceso VPN, Wi-Fi institucional y navegación interna",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 4,
    codigo: "ACC",
    nombre: "Accesos y Credenciales",
    descripcion: "Gestión de cuentas de dominio, restablecimiento de contraseñas y permisos",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 5,
    codigo: "SEG",
    nombre: "Seguridad de la Información",
    descripcion: "Reporte de incidentes de seguridad, correos sospechosos y antivirus",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export let mockPriorities = [
  {
    id: 1,
    codigo: "BAJA",
    nombre: "Baja",
    nivel: 1,
    tiempoResolucionHoras: 48,
    colorHex: "#16a34a",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 2,
    codigo: "MEDIA",
    nombre: "Media",
    nivel: 2,
    tiempoResolucionHoras: 24,
    colorHex: "#0284c7",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 3,
    codigo: "ALTA",
    nombre: "Alta",
    nivel: 3,
    tiempoResolucionHoras: 8,
    colorHex: "#ea580c",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 4,
    codigo: "CRITICA",
    nombre: "Crítica",
    nivel: 4,
    tiempoResolucionHoras: 2,
    colorHex: "#dc2626",
    activo: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export let mockTickets = [
  {
    id: 10,
    titulo: "Falla en acceso a suite Microsoft 365 y Teams",
    descripcion: "No puedo ingresar a Teams con la cuenta cliente.prueba, arroja error de autenticación institucional.",
    categoria: "Software y Aplicaciones",
    prioridad: "Alta",
    usuarioSolicitante: "cliente.prueba@curzua1.onmicrosoft.com",
    usuarioAsignado: "",
    estado: "CREADA",
    pasoPorEnProceso: false,
    fechaCreacion: new Date(Date.now() - 3600000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 3600000).toISOString(),
    apiVersion: "v2.0-enhanced",
    slaHorasMaximo: 8,
    minutosTranscurridos: 60,
    estadoSla: "DENTRO_DE_PLAZO",
    posiblesSiguientesEstados: ["ASIGNADA", "CANCELADA"],
    historialAuditoria: [
      {
        id: 1,
        solicitudId: 10,
        estadoAnterior: "CREADA",
        estadoNuevo: "CREADA",
        usuario: "cliente.prueba@curzua1.onmicrosoft.com",
        observacion: "Solicitud registrada en plataforma MesaTech Cloud",
        fechaTransicion: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  },
  {
    id: 11,
    titulo: "Solicitud de monitor secundario para teletrabajo",
    descripcion: "Se requiere monitor FHD de 24 pulgadas y adaptador HDMI para labores de desarrollo y análisis.",
    categoria: "Hardware y Equipamiento",
    prioridad: "Media",
    usuarioSolicitante: "cliente.prueba@curzua1.onmicrosoft.com",
    usuarioAsignado: "operador.prueba@curzua1.onmicrosoft.com",
    estado: "ASIGNADA",
    pasoPorEnProceso: false,
    fechaCreacion: new Date(Date.now() - 18000000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 7200000).toISOString(),
    apiVersion: "v2.0-enhanced",
    slaHorasMaximo: 24,
    minutosTranscurridos: 300,
    estadoSla: "DENTRO_DE_PLAZO",
    posiblesSiguientesEstados: ["EN_PROCESO", "CANCELADA"],
    historialAuditoria: [
      {
        id: 2,
        solicitudId: 11,
        estadoAnterior: "CREADA",
        estadoNuevo: "CREADA",
        usuario: "cliente.prueba@curzua1.onmicrosoft.com",
        observacion: "Solicitud inicial registrada",
        fechaTransicion: new Date(Date.now() - 18000000).toISOString()
      },
      {
        id: 3,
        solicitudId: 11,
        estadoAnterior: "CREADA",
        estadoNuevo: "ASIGNADA",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Asignado al operador: Carlos Operador",
        fechaTransicion: new Date(Date.now() - 7200000).toISOString()
      }
    ]
  },
  {
    id: 12,
    titulo: "Problema con certificado VPN institucional",
    descripcion: "El túnel VPN corporativo desconecta cada 15 minutos por expiración del certificado de cliente.",
    categoria: "Redes y Conectividad",
    prioridad: "Alta",
    usuarioSolicitante: "cliente.prueba@curzua1.onmicrosoft.com",
    usuarioAsignado: "operador.prueba@curzua1.onmicrosoft.com",
    estado: "EN_PROCESO",
    pasoPorEnProceso: true,
    fechaCreacion: new Date(Date.now() - 86400000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 10800000).toISOString(),
    apiVersion: "v2.0-enhanced",
    slaHorasMaximo: 8,
    minutosTranscurridos: 240,
    estadoSla: "DENTRO_DE_PLAZO",
    posiblesSiguientesEstados: ["RESUELTA", "CANCELADA"],
    historialAuditoria: [
      {
        id: 4,
        solicitudId: 12,
        estadoAnterior: "CREADA",
        estadoNuevo: "CREADA",
        usuario: "cliente.prueba@curzua1.onmicrosoft.com",
        observacion: "Reporte de problema de red",
        fechaTransicion: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 5,
        solicitudId: 12,
        estadoAnterior: "CREADA",
        estadoNuevo: "ASIGNADA",
        usuario: "sistema",
        observacion: "Asignación automática a cola técnica",
        fechaTransicion: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 6,
        solicitudId: 12,
        estadoAnterior: "ASIGNADA",
        estadoNuevo: "EN_PROCESO",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Atendiendo revisión de certificado digital con Carlos Operador",
        fechaTransicion: new Date(Date.now() - 10800000).toISOString()
      }
    ]
  },
  {
    id: 13,
    titulo: "Desbloqueo de clave y enrolamiento MFA",
    descripcion: "Cuenta temporalmente bloqueada por expiración periódica de credenciales de Active Directory.",
    categoria: "Accesos y Credenciales",
    prioridad: "Crítica",
    usuarioSolicitante: "cliente.prueba@curzua1.onmicrosoft.com",
    usuarioAsignado: "operador.prueba@curzua1.onmicrosoft.com",
    estado: "RESUELTA",
    pasoPorEnProceso: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 2).toISOString(),
    fechaActualizacion: new Date(Date.now() - 21600000).toISOString(),
    apiVersion: "v2.0-enhanced",
    slaHorasMaximo: 2,
    minutosTranscurridos: 110,
    estadoSla: "DENTRO_DE_PLAZO",
    posiblesSiguientesEstados: ["CERRADA"],
    historialAuditoria: [
      {
        id: 7,
        solicitudId: 13,
        estadoAnterior: "CREADA",
        estadoNuevo: "ASIGNADA",
        usuario: "sistema",
        observacion: "Asignación inicial",
        fechaTransicion: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 8,
        solicitudId: 13,
        estadoAnterior: "ASIGNADA",
        estadoNuevo: "EN_PROCESO",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Comprobando identidad del usuario en consola Azure AD",
        fechaTransicion: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 9,
        solicitudId: 13,
        estadoAnterior: "EN_PROCESO",
        estadoNuevo: "RESUELTA",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Clave temporal enviada al correo alternativo y MFA verificado",
        fechaTransicion: new Date(Date.now() - 21600000).toISOString()
      }
    ]
  },
  {
    id: 14,
    titulo: "Renovación de licencia antivirus corporativo",
    descripcion: "Licencia de Endpoint Protection vencida en equipo asignado para teletrabajo.",
    categoria: "Seguridad de la Información",
    prioridad: "Baja",
    usuarioSolicitante: "cliente.prueba@curzua1.onmicrosoft.com",
    usuarioAsignado: "operador.prueba@curzua1.onmicrosoft.com",
    estado: "CERRADA",
    pasoPorEnProceso: true,
    fechaCreacion: new Date(Date.now() - 86400000 * 3).toISOString(),
    fechaActualizacion: new Date(Date.now() - 86400000).toISOString(),
    apiVersion: "v2.0-enhanced",
    slaHorasMaximo: 48,
    minutosTranscurridos: 1440,
    estadoSla: "DENTRO_DE_PLAZO",
    posiblesSiguientesEstados: [],
    historialAuditoria: [
      {
        id: 10,
        solicitudId: 14,
        estadoAnterior: "CREADA",
        estadoNuevo: "ASIGNADA",
        usuario: "sistema",
        observacion: "Ingreso al sistema",
        fechaTransicion: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 11,
        solicitudId: 14,
        estadoAnterior: "ASIGNADA",
        estadoNuevo: "EN_PROCESO",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Actualizando firmas y políticas de antivirus",
        fechaTransicion: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 12,
        solicitudId: 14,
        estadoAnterior: "EN_PROCESO",
        estadoNuevo: "RESUELTA",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Equipo protegido y sincronizado",
        fechaTransicion: new Date(Date.now() - 86400000 * 1.5).toISOString()
      },
      {
        id: 13,
        solicitudId: 14,
        estadoAnterior: "RESUELTA",
        estadoNuevo: "CERRADA",
        usuario: "cliente.prueba@curzua1.onmicrosoft.com",
        observacion: "Conformidad recibida del usuario",
        fechaTransicion: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  },
  {
    id: 15,
    titulo: "Actualización de memoria RAM a 32GB",
    descripcion: "Requerimiento de ampliación de memoria para pruebas de laboratorio y contenedores Docker.",
    categoria: "Hardware y Equipamiento",
    prioridad: "Media",
    usuarioSolicitante: "admin.prueba@curzua1.onmicrosoft.com",
    usuarioAsignado: "operador.prueba@curzua1.onmicrosoft.com",
    estado: "ASIGNADA",
    pasoPorEnProceso: false,
    fechaCreacion: new Date(Date.now() - 28800000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 14400000).toISOString(),
    apiVersion: "v2.0-enhanced",
    slaHorasMaximo: 24,
    minutosTranscurridos: 480,
    estadoSla: "DENTRO_DE_PLAZO",
    posiblesSiguientesEstados: ["EN_PROCESO", "CANCELADA"],
    historialAuditoria: [
      {
        id: 14,
        solicitudId: 15,
        estadoAnterior: "CREADA",
        estadoNuevo: "CREADA",
        usuario: "admin.prueba@curzua1.onmicrosoft.com",
        observacion: "Solicitud administrativa registrada",
        fechaTransicion: new Date(Date.now() - 28800000).toISOString()
      },
      {
        id: 15,
        solicitudId: 15,
        estadoAnterior: "CREADA",
        estadoNuevo: "ASIGNADA",
        usuario: "operador.prueba@curzua1.onmicrosoft.com",
        observacion: "Asignado al operador Carlos Operador",
        fechaTransicion: new Date(Date.now() - 14400000).toISOString()
      }
    ]
  }
];

let nextTicketId = 16;
let nextCategoryId = 6;
let nextPriorityId = 5;
let nextAuditId = 16;

export const mockRepo = {
  // Solicitudes
  getTickets: (params = {}, version = "v1") => {
    let result = [...mockTickets];
    if (params.usuarioSolicitante) {
      result = result.filter(t => t.usuarioSolicitante.toLowerCase() === params.usuarioSolicitante.toLowerCase());
    }
    if (params.usuarioAsignado) {
      result = result.filter(t => t.usuarioAsignado.toLowerCase() === params.usuarioAsignado.toLowerCase());
    }
    if (params.estado) {
      result = result.filter(t => t.estado === params.estado);
    }
    // Ordenar de más reciente a más antiguo
    return result.sort((a, b) => b.id - a.id);
  },

  getTicketById: (id) => {
    const ticket = mockTickets.find(t => t.id === Number(id));
    if (!ticket) throw new Error(`Solicitud #${id} no encontrada.`);
    return ticket;
  },

  createTicket: (data) => {
    const id = nextTicketId++;
    const now = new Date().toISOString();
    const newTicket = {
      id,
      titulo: data.titulo,
      descripcion: data.descripcion,
      categoria: data.categoria || "Software y Aplicaciones",
      prioridad: data.prioridad || "Media",
      usuarioSolicitante: data.usuarioSolicitante || "cliente.prueba@curzua1.onmicrosoft.com",
      usuarioAsignado: "",
      estado: "CREADA",
      pasoPorEnProceso: false,
      fechaCreacion: now,
      fechaActualizacion: now,
      apiVersion: "v2.0-enhanced",
      slaHorasMaximo: 24,
      minutosTranscurridos: 0,
      estadoSla: "DENTRO_DE_PLAZO",
      posiblesSiguientesEstados: ["ASIGNADA", "CANCELADA"],
      historialAuditoria: [
        {
          id: nextAuditId++,
          solicitudId: id,
          estadoAnterior: "CREADA",
          estadoNuevo: "CREADA",
          usuario: data.usuarioSolicitante || "cliente.prueba@curzua1.onmicrosoft.com",
          observacion: "Solicitud creada en el sistema",
          fechaTransicion: now
        }
      ]
    };
    mockTickets.unshift(newTicket);
    return newTicket;
  },

  changeTicketState: (id, data) => {
    const ticket = mockTickets.find(t => t.id === Number(id));
    if (!ticket) throw new Error(`Solicitud #${id} no encontrada.`);

    const nuevoEstado = data.nuevoEstado;

    // Validación de Regla Crítica del Caso de Negocio:
    // "Una solicitud NO puede pasar a RESUELTA si antes no pasó por EN_PROCESO"
    if (nuevoEstado === "RESUELTA" && !ticket.pasoPorEnProceso && ticket.estado !== "EN_PROCESO") {
      const error = new Error("Una solicitud no puede pasar a estado RESUELTA si antes no pasó por EN_PROCESO.");
      error.response = {
        status: 422,
        data: {
          status: 422,
          error: "Unprocessable Entity",
          message: "Una solicitud no puede pasar a estado RESUELTA si antes no pasó por EN_PROCESO."
        }
      };
      throw error;
    }

    const estadoAnterior = ticket.estado;
    ticket.estado = nuevoEstado;
    if (nuevoEstado === "EN_PROCESO") {
      ticket.pasoPorEnProceso = true;
    }
    ticket.fechaActualizacion = new Date().toISOString();

    // Actualizar posibles siguientes estados
    if (nuevoEstado === "CREADA") ticket.posiblesSiguientesEstados = ["ASIGNADA", "CANCELADA"];
    else if (nuevoEstado === "ASIGNADA") ticket.posiblesSiguientesEstados = ["EN_PROCESO", "CANCELADA"];
    else if (nuevoEstado === "EN_PROCESO") ticket.posiblesSiguientesEstados = ["RESUELTA", "CANCELADA"];
    else if (nuevoEstado === "RESUELTA") ticket.posiblesSiguientesEstados = ["CERRADA"];
    else ticket.posiblesSiguientesEstados = [];

    // Agregar a historial
    ticket.historialAuditoria = ticket.historialAuditoria || [];
    ticket.historialAuditoria.push({
      id: nextAuditId++,
      solicitudId: ticket.id,
      estadoAnterior,
      estadoNuevo: nuevoEstado,
      usuario: data.usuario || "operador.prueba@curzua1.onmicrosoft.com",
      observacion: data.observacion || `Estado actualizado a ${nuevoEstado}`,
      fechaTransicion: ticket.fechaActualizacion
    });

    return ticket;
  },

  assignTicket: (id, data) => {
    const ticket = mockTickets.find(t => t.id === Number(id));
    if (!ticket) throw new Error(`Solicitud #${id} no encontrada.`);

    const estadoAnterior = ticket.estado;
    ticket.usuarioAsignado = data.usuarioOperador || "operador.prueba@curzua1.onmicrosoft.com";
    ticket.estado = "ASIGNADA";
    ticket.fechaActualizacion = new Date().toISOString();
    ticket.posiblesSiguientesEstados = ["EN_PROCESO", "CANCELADA"];

    ticket.historialAuditoria = ticket.historialAuditoria || [];
    ticket.historialAuditoria.push({
      id: nextAuditId++,
      solicitudId: ticket.id,
      estadoAnterior,
      estadoNuevo: "ASIGNADA",
      usuario: data.asignadoPor || data.usuarioOperador,
      observacion: `Asignado al operador: ${ticket.usuarioAsignado}`,
      fechaTransicion: ticket.fechaActualizacion
    });

    return ticket;
  },

  // Categorías
  getCategories: (soloActivas = false) => {
    if (soloActivas) return mockCategories.filter(c => c.activo);
    return [...mockCategories];
  },

  createCategory: (data) => {
    const newCat = {
      id: nextCategoryId++,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo !== undefined ? data.activo : true,
      fechaCreacion: new Date().toISOString()
    };
    mockCategories.push(newCat);
    return newCat;
  },

  updateCategory: (id, data) => {
    const cat = mockCategories.find(c => c.id === Number(id));
    if (!cat) throw new Error(`Categoría #${id} no encontrada.`);
    Object.assign(cat, data);
    return cat;
  },

  deleteCategory: (id) => {
    const cat = mockCategories.find(c => c.id === Number(id));
    if (cat) cat.activo = false;
    return { success: true };
  },

  // Prioridades
  getPriorities: (soloActivas = false) => {
    if (soloActivas) return mockPriorities.filter(p => p.activo);
    return [...mockPriorities];
  },

  createPriority: (data) => {
    const newPrio = {
      id: nextPriorityId++,
      codigo: data.codigo,
      nombre: data.nombre,
      nivel: data.nivel || 1,
      tiempoResolucionHoras: data.tiempoResolucionHoras || 24,
      colorHex: data.colorHex || "#0284c7",
      activo: data.activo !== undefined ? data.activo : true,
      fechaCreacion: new Date().toISOString()
    };
    mockPriorities.push(newPrio);
    return newPrio;
  },

  updatePriority: (id, data) => {
    const prio = mockPriorities.find(p => p.id === Number(id));
    if (!prio) throw new Error(`Prioridad #${id} no encontrada.`);
    Object.assign(prio, data);
    return prio;
  },

  deletePriority: (id) => {
    const prio = mockPriorities.find(p => p.id === Number(id));
    if (prio) prio.activo = false;
    return { success: true };
  }
};
