import React, { useState, useEffect } from "react";
import { ticketService } from "../services/apiService";
import { StatusBadge } from "../components/StatusBadge";
import { WorkflowStepper } from "../components/WorkflowStepper";
import { RefreshCw, PlayCircle, CheckCircle2, AlertTriangle, UserCheck } from "lucide-react";

export const OperadorDashboard = ({ currentUser }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState("TODAS");

  useEffect(() => {
    cargarSolicitudes();
  }, [filtro]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtro === "ASIGNADAS") {
        params.usuarioAsignado = currentUser?.username || currentUser?.email || "operador.prueba@curzua1.onmicrosoft.com";
      }
      const res = await ticketService.listarV2(params);
      setSolicitudes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn("Aviso al cargar solicitudes operador:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransicionEstado = async (id, nuevoEstado, observacion = "") => {
    try {
      await ticketService.cambiarEstado(id, {
        nuevoEstado,
        usuario: currentUser?.username || currentUser?.email || "operador.prueba@curzua1.onmicrosoft.com",
        observacion: observacion || `Estado actualizado a ${nuevoEstado} por operador`
      });
      setMensaje({ tipo: "success", texto: `Solicitud #${id} transicionada exitosamente a ${nuevoEstado}.` });
      cargarSolicitudes();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setMensaje({
        tipo: "error",
        texto: `[REGLA DE NEGOCIO DETECTADA]: ${errorMsg}`
      });
    }
  };

  const handleAsignar = async (id) => {
    try {
      await ticketService.asignarOperador(id, {
        usuarioOperador: currentUser?.username || currentUser?.email || "operador.prueba@curzua1.onmicrosoft.com",
        asignadoPor: currentUser?.username || currentUser?.email || "operador.prueba@curzua1.onmicrosoft.com"
      });
      setMensaje({ tipo: "success", texto: `Solicitud #${id} asignada a tu usuario.` });
      cargarSolicitudes();
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al asignar: " + (err.response?.data?.message || err.message) });
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                <UserCheck size={22} color="#d97706" />
                Consola de Atención Técnica
              </h2>
              <span style={{
                backgroundColor: "#d97706",
                color: "white",
                padding: "0.2rem 0.6rem",
                borderRadius: "0.25rem",
                fontSize: "0.75rem",
                fontWeight: "bold"
              }}>
                Cargo: {currentUser?.cargo || "Operador"}
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              Operador conectado: <strong>{currentUser?.name || "Carlos Operador"}</strong> ({currentUser?.username || "operador.prueba@curzua1.onmicrosoft.com"})
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select
              className="form-control"
              style={{ width: "auto", fontSize: "0.82rem" }}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="TODAS">Ver Todas las Solicitudes</option>
              <option value="ASIGNADAS">Mis Solicitudes Asignadas</option>
            </select>
            <button className="btn btn-outline btn-sm" onClick={cargarSolicitudes} disabled={loading}>
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              Refrescar
            </button>
          </div>
        </div>

        {mensaje && (
          <div className={mensaje.tipo === "success" ? "alert alert-success" : "alert alert-danger"}>
            {mensaje.tipo === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {mensaje.texto}
          </div>
        )}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Requerimiento</th>
                <th>Solicitante</th>
                <th>Operador Asignado</th>
                <th>Estado Actual</th>
                <th>Flujo de Vida</th>
                <th>Métricas SLA (v2)</th>
                <th>Acciones de Estado Permitidas</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    {loading ? "Cargando solicitudes..." : "No hay solicitudes pendientes en este filtro."}
                  </td>
                </tr>
              ) : (
                solicitudes.map((sol) => (
                  <tr key={sol.id}>
                    <td style={{ fontWeight: 700, color: "var(--text-muted)" }}>#{sol.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sol.titulo}</div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {sol.categoria} • Prioridad: {sol.prioridad}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>{sol.usuarioSolicitante}</td>
                    <td style={{ fontSize: "0.82rem" }}>
                      {sol.usuarioAsignado ? (
                        <span style={{ color: "#0369a1", fontWeight: 600 }}>{sol.usuarioAsignado}</span>
                      ) : (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem" }}
                          onClick={() => handleAsignar(sol.id)}
                        >
                          Asignarme
                        </button>
                      )}
                    </td>
                    <td>
                      <StatusBadge estado={sol.estado} />
                    </td>
                    <td>
                      <WorkflowStepper estadoActual={sol.estado} />
                    </td>
                    <td>
                      {sol.estadoSla && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            background: sol.estadoSla === "DENTRO_DE_PLAZO" ? "#dcfce7" : sol.estadoSla === "EN_RIESGO" ? "#fef3c7" : "#fee2e2",
                            color: sol.estadoSla === "DENTRO_DE_PLAZO" ? "#166534" : sol.estadoSla === "EN_RIESGO" ? "#b45309" : "#991b1b"
                          }}
                        >
                          {sol.estadoSla} ({sol.minutosTranscurridos}m / {sol.slaHorasMaximo}h)
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        {/* Acciones según estado actual */}
                        {sol.estado === "CREADA" && (
                          <>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleTransicionEstado(sol.id, "ASIGNADA", "Asignado para atención")}
                            >
                              Pasar a ASIGNADA
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleTransicionEstado(sol.id, "CANCELADA", "Cancelado por operador")}
                            >
                              Cancelar
                            </button>
                            {/* Botón de Demostración de Error al Docente */}
                            <button
                              className="btn btn-sm"
                              style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "0.68rem" }}
                              title="Demostrar rechazo de regla de negocio"
                              onClick={() => handleTransicionEstado(sol.id, "RESUELTA", "Intento de salto indebido")}
                            >
                              ⚡ Probar Salto Ilegal a RESUELTA
                            </button>
                          </>
                        )}

                        {sol.estado === "ASIGNADA" && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleTransicionEstado(sol.id, "EN_PROCESO", "Iniciando diagnóstico técnico")}
                            >
                              <PlayCircle size={14} /> Iniciar EN_PROCESO
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleTransicionEstado(sol.id, "CANCELADA", "Cancelado")}
                            >
                              Cancelar
                            </button>
                            {/* Botón de Demostración de Error al Docente */}
                            <button
                              className="btn btn-sm"
                              style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "0.68rem" }}
                              title="Demostrar rechazo de regla de negocio"
                              onClick={() => handleTransicionEstado(sol.id, "RESUELTA", "Intento de salto indebido")}
                            >
                              ⚡ Probar Salto Ilegal a RESUELTA
                            </button>
                          </>
                        )}

                        {sol.estado === "EN_PROCESO" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleTransicionEstado(sol.id, "RESUELTA", "Incidencia resuelta exitosamente")}
                            >
                              <CheckCircle2 size={14} /> Marcar RESUELTA
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleTransicionEstado(sol.id, "CANCELADA", "Cancelado")}
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {sol.estado === "RESUELTA" && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleTransicionEstado(sol.id, "CERRADA", "Ticket cerrado y verificado")}
                          >
                            Cerrar Ticket (CERRADA)
                          </button>
                        )}

                        {(sol.estado === "CERRADA" || sol.estado === "CANCELADA") && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                            Estado Final
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
