import React, { useState, useEffect } from "react";
import { ticketService, catalogService } from "../services/apiService";
import { StatusBadge } from "../components/StatusBadge";
import { WorkflowStepper } from "../components/WorkflowStepper";
import {
  ShieldAlert,
  Layers,
  PlusCircle,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";

export const AdminDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("SOLICITUDES"); // SOLICITUDES, CATEGORIAS, PRIORIDADES
  const [apiVersion, setApiVersion] = useState("v2"); // v1 o v2
  const [solicitudes, setSolicitudes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Modales CRUD
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ codigo: "", nombre: "", descripcion: "", activo: true });

  const [showPrioModal, setShowPrioModal] = useState(false);
  const [editingPrio, setEditingPrio] = useState(null);
  const [prioForm, setPrioForm] = useState({ codigo: "", nombre: "", nivel: 1, tiempoResolucionHoras: 24, colorHex: "#0284c7", activo: true });

  useEffect(() => {
    if (activeTab === "SOLICITUDES") {
      cargarSolicitudes();
    } else if (activeTab === "CATEGORIAS") {
      cargarCategorias();
    } else if (activeTab === "PRIORIDADES") {
      cargarPrioridades();
    }
  }, [activeTab, apiVersion]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const res = apiVersion === "v2" ? await ticketService.listarV2() : await ticketService.listarV1();
      setSolicitudes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn("Aviso al cargar solicitudes admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const res = await catalogService.listarCategorias(false);
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cargar catálogo de categorías: " + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
    }
  };

  const cargarPrioridades = async () => {
    setLoading(true);
    try {
      const res = await catalogService.listarPrioridades(false);
      setPrioridades(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al cargar catálogo de prioridades: " + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo Categorías ---
  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await catalogService.actualizarCategoria(editingCat.id, catForm);
        setMensaje({ tipo: "success", texto: "Categoría actualizada exitosamente." });
      } else {
        await catalogService.crearCategoria(catForm);
        setMensaje({ tipo: "success", texto: "Categoría creada exitosamente en el catálogo." });
      }
      setShowCatModal(false);
      setEditingCat(null);
      setCatForm({ codigo: "", nombre: "", descripcion: "", activo: true });
      cargarCategorias();
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al guardar categoría: " + (err.response?.data?.message || err.message) });
    }
  };

  const handleEliminarCategoria = async (id) => {
    if (window.confirm("¿Seguro que deseas desactivar esta categoría del catálogo?")) {
      try {
        await catalogService.eliminarCategoria(id);
        setMensaje({ tipo: "success", texto: "Categoría desactivada." });
        cargarCategorias();
      } catch (err) {
        setMensaje({ tipo: "error", texto: "Error al eliminar: " + (err.response?.data?.message || err.message) });
      }
    }
  };

  // --- Manejo Prioridades ---
  const handleGuardarPrioridad = async (e) => {
    e.preventDefault();
    try {
      if (editingPrio) {
        await catalogService.actualizarPrioridad(editingPrio.id, prioForm);
        setMensaje({ tipo: "success", texto: "Prioridad actualizada exitosamente." });
      } else {
        await catalogService.crearPrioridad(prioForm);
        setMensaje({ tipo: "success", texto: "Prioridad creada exitosamente en el catálogo." });
      }
      setShowPrioModal(false);
      setEditingPrio(null);
      setPrioForm({ codigo: "", nombre: "", nivel: 1, tiempoResolucionHoras: 24, colorHex: "#0284c7", activo: true });
      cargarPrioridades();
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al guardar prioridad: " + (err.response?.data?.message || err.message) });
    }
  };

  const handleEliminarPrioridad = async (id) => {
    if (window.confirm("¿Seguro que deseas desactivar esta prioridad?")) {
      try {
        await catalogService.eliminarPrioridad(id);
        setMensaje({ tipo: "success", texto: "Prioridad desactivada." });
        cargarPrioridades();
      } catch (err) {
        setMensaje({ tipo: "error", texto: "Error al eliminar: " + (err.response?.data?.message || err.message) });
      }
    }
  };

  return (
    <div>
      {/* Selector de Pestañas de Administración */}
      <div className="tabs-header" style={{ marginBottom: "1.5rem", borderRadius: "0.5rem" }}>
        <button
          className={`tab-button ${activeTab === "SOLICITUDES" ? "active" : ""}`}
          onClick={() => setActiveTab("SOLICITUDES")}
        >
          <Layers size={18} /> Todas las Solicitudes (v1 / v2)
        </button>
        <button
          className={`tab-button ${activeTab === "CATEGORIAS" ? "active" : ""}`}
          onClick={() => setActiveTab("CATEGORIAS")}
        >
          <ShieldAlert size={18} /> Mantenedor de Categorías (CRUD)
        </button>
        <button
          className={`tab-button ${activeTab === "PRIORIDADES" ? "active" : ""}`}
          onClick={() => setActiveTab("PRIORIDADES")}
        >
          <Clock size={18} /> Mantenedor de Prioridades y SLA (CRUD)
        </button>
      </div>

      {mensaje && (
        <div className={mensaje.tipo === "success" ? "alert alert-success" : "alert alert-danger"}>
          {mensaje.tipo === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {mensaje.texto}
        </div>
      )}

      {/* Pestaña 1: Solicitudes Globales y Versionamiento de APIs */}
      {activeTab === "SOLICITUDES" && (
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h2 className="card-title" style={{ margin: 0 }}>
                  <Layers size={22} color="#7c3aed" />
                  Auditoría Global de Solicitudes y Versionamiento
                </h2>
                <span style={{
                  backgroundColor: "#7c3aed",
                  color: "white",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}>
                  Cargo: {currentUser?.cargo || "Administrador"}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                Administrador: <strong>{currentUser?.name || "Andrés Administrador"}</strong> ({currentUser?.username || "admin.prueba@curzua1.onmicrosoft.com"})
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ display: "flex", background: "#f1f5f9", padding: "0.2rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}>
                <button
                  className={`btn btn-sm ${apiVersion === "v1" ? "btn-primary" : "btn-outline"}`}
                  style={{ border: "none" }}
                  onClick={() => setApiVersion("v1")}
                >
                  API v1 (Básica)
                </button>
                <button
                  className={`btn btn-sm ${apiVersion === "v2" ? "btn-primary" : "btn-outline"}`}
                  style={{ border: "none" }}
                  onClick={() => setApiVersion("v2")}
                >
                  <Sparkles size={14} /> API v2 (Enriquecida)
                </button>
              </div>

              <button className="btn btn-outline btn-sm" onClick={cargarSolicitudes} disabled={loading}>
                <RefreshCw size={14} className={loading ? "spin" : ""} />
                Actualizar
              </button>
            </div>
          </div>

          <div style={{ padding: "0.5rem 1rem", background: "#f8fafc", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.8rem", border: "1px solid #e2e8f0" }}>
            Endpoint actual consumido: <strong style={{ color: "#0284c7" }}>/{apiVersion}/solicitudes</strong>
            {apiVersion === "v2" && " (Incluye: SLA dinámico, estado de riesgo, cálculo de minutos transcurridos y trazabilidad completa de auditoría)"}
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Requerimiento</th>
                  <th>Solicitante</th>
                  <th>Operador</th>
                  <th>Estado</th>
                  <th>Flujo de Vida</th>
                  {apiVersion === "v2" && <th>SLA y Métricas v2</th>}
                  <th>Fecha Creación</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id}>
                    <td style={{ fontWeight: 700, color: "var(--text-muted)" }}>#{sol.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sol.titulo}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sol.categoria} • {sol.prioridad}</div>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>{sol.usuarioSolicitante}</td>
                    <td style={{ fontSize: "0.82rem" }}>{sol.usuarioAsignado || "Sin asignar"}</td>
                    <td>
                      <StatusBadge estado={sol.estado} />
                    </td>
                    <td>
                      <WorkflowStepper estadoActual={sol.estado} />
                    </td>
                    {apiVersion === "v2" && (
                      <td>
                        {sol.estadoSla && (
                          <div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                                background: sol.estadoSla === "DENTRO_DE_PLAZO" ? "#dcfce7" : "#fee2e2",
                                color: sol.estadoSla === "DENTRO_DE_PLAZO" ? "#166534" : "#991b1b"
                              }}
                            >
                              {sol.estadoSla}
                            </span>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                              {sol.minutosTranscurridos} min transcurridos (Máx: {sol.slaHorasMaximo}h)
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {sol.fechaCreacion ? new Date(sol.fechaCreacion).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pestaña 2: Catálogo de Categorías */}
      {activeTab === "CATEGORIAS" && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <ShieldAlert size={22} color="#0284c7" />
                Catálogo de Categorías de Soporte (Microservicio 2)
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                CRUD administrable exclusivamente por usuarios con rol <strong>Administrador</strong>.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingCat(null);
                setCatForm({ codigo: "", nombre: "", descripcion: "", activo: true });
                setShowCatModal(true);
              }}
            >
              <PlusCircle size={16} /> Nueva Categoría
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td><strong style={{ color: "#0284c7" }}>{c.codigo}</strong></td>
                    <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{c.descripcion}</td>
                    <td>
                      <span className={c.activo ? "status-badge status-resuelta" : "status-badge status-cancelada"}>
                        {c.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setEditingCat(c);
                            setCatForm({ codigo: c.codigo, nombre: c.nombre, descripcion: c.descripcion || "", activo: c.activo });
                            setShowCatModal(true);
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminarCategoria(c.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pestaña 3: Catálogo de Prioridades */}
      {activeTab === "PRIORIDADES" && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <Clock size={22} color="#0284c7" />
                Catálogo de Prioridades y Tiempos de Resolución SLA
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Configuración de tiempos máximos permitidos para la resolución de tickets de soporte.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingPrio(null);
                setPrioForm({ codigo: "", nombre: "", nivel: 1, tiempoResolucionHoras: 24, colorHex: "#0284c7", activo: true });
                setShowPrioModal(true);
              }}
            >
              <PlusCircle size={16} /> Nueva Prioridad
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th>Tiempo SLA Máximo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prioridades.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td><strong style={{ color: "#0284c7" }}>{p.codigo}</strong></td>
                    <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                    <td>Nivel {p.nivel}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#b45309" }}>
                        {p.tiempoResolucionHoras} Horas
                      </span>
                    </td>
                    <td>
                      <span className={p.activo ? "status-badge status-resuelta" : "status-badge status-cancelada"}>
                        {p.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setEditingPrio(p);
                            setPrioForm({
                              codigo: p.codigo,
                              nombre: p.nombre,
                              nivel: p.nivel,
                              tiempoResolucionHoras: p.tiempoResolucionHoras,
                              colorHex: p.colorHex || "#0284c7",
                              activo: p.activo
                            });
                            setShowPrioModal(true);
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminarPrioridad(p.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {showCatModal && (
        <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCat ? "Editar Categoría" : "Crear Nueva Categoría"}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowCatModal(false)}>✕</button>
            </div>
            <form onSubmit={handleGuardarCategoria}>
              <div className="form-group">
                <label className="form-label">Código Único (Ej: HW, SW, SEG) *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  disabled={!!editingCat}
                  value={catForm.codigo}
                  onChange={(e) => setCatForm({ ...catForm, codigo: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de Categoría *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={catForm.nombre}
                  onChange={(e) => setCatForm({ ...catForm, nombre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={catForm.descripcion}
                  onChange={(e) => setCatForm({ ...catForm, descripcion: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowCatModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Categoría</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Prioridad */}
      {showPrioModal && (
        <div className="modal-overlay" onClick={() => setShowPrioModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingPrio ? "Editar Prioridad" : "Crear Nueva Prioridad"}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowPrioModal(false)}>✕</button>
            </div>
            <form onSubmit={handleGuardarPrioridad}>
              <div className="form-group">
                <label className="form-label">Código (Ej: BAJA, ALTA, URGENTE) *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  disabled={!!editingPrio}
                  value={prioForm.codigo}
                  onChange={(e) => setPrioForm({ ...prioForm, codigo: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={prioForm.nombre}
                  onChange={(e) => setPrioForm({ ...prioForm, nombre: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Nivel (1 a 5) *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    required
                    value={prioForm.nivel}
                    onChange={(e) => setPrioForm({ ...prioForm, nivel: parseInt(e.target.value, 10) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tiempo SLA (Horas) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    required
                    value={prioForm.tiempoResolucionHoras}
                    onChange={(e) => setPrioForm({ ...prioForm, tiempoResolucionHoras: parseInt(e.target.value, 10) })}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowPrioModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Prioridad</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
