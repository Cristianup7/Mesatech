package com.mesatech.solicitudes.dto;

import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.model.HistorialTransicion;
import com.mesatech.solicitudes.model.Solicitud;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

public class SolicitudResponseV2DTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private String categoria;
    private String prioridad;
    private String usuarioSolicitante;
    private String usuarioAsignado;
    private EstadoSolicitud estado;
    private boolean pasoPorEnProceso;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Campos Enriquecidos versión 2
    private String apiVersion = "v2.0-enhanced";
    private int slaHorasMaximo;
    private long minutosTranscurridos;
    private String estadoSla; // DENTRO_DE_PLAZO, EN_RIESGO, VENCIDO
    private List<EstadoSolicitud> posiblesSiguientesEstados;
    private List<HistorialTransicion> historialAuditoria;

    public SolicitudResponseV2DTO() {
    }

    public static SolicitudResponseV2DTO fromEntity(
            Solicitud entity,
            List<EstadoSolicitud> siguientesEstados,
            List<HistorialTransicion> historial) {

        SolicitudResponseV2DTO dto = new SolicitudResponseV2DTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setCategoria(entity.getCategoria());
        dto.setPrioridad(entity.getPrioridad());
        dto.setUsuarioSolicitante(entity.getUsuarioSolicitante());
        dto.setUsuarioAsignado(entity.getUsuarioAsignado());
        dto.setEstado(entity.getEstado());
        dto.setPasoPorEnProceso(entity.isTuvoEnProceso());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setFechaActualizacion(entity.getFechaActualizacion());
        dto.setPosiblesSiguientesEstados(siguientesEstados);
        dto.setHistorialAuditoria(historial);

        // Cálculo dinámico de SLA
        int slaHoras = switch (entity.getPrioridad().toUpperCase()) {
            case "CRÍTICA", "CRITICA" -> 2;
            case "ALTA" -> 8;
            case "MEDIA" -> 24;
            default -> 48; // BAJA
        };
        dto.setSlaHorasMaximo(slaHoras);

        LocalDateTime finCalculo = (entity.getEstado() == EstadoSolicitud.RESUELTA || entity.getEstado() == EstadoSolicitud.CERRADA)
                ? entity.getFechaActualizacion()
                : LocalDateTime.now();

        long minutos = Duration.between(entity.getFechaCreacion(), finCalculo).toMinutes();
        dto.setMinutosTranscurridos(Math.max(0, minutos));

        long minutosLimite = (long) slaHoras * 60;
        if (minutos > minutosLimite) {
            dto.setEstadoSla("VENCIDO");
        } else if (minutos > (minutosLimite * 0.75)) {
            dto.setEstadoSla("EN_RIESGO");
        } else {
            dto.setEstadoSla("DENTRO_DE_PLAZO");
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getUsuarioSolicitante() {
        return usuarioSolicitante;
    }

    public void setUsuarioSolicitante(String usuarioSolicitante) {
        this.usuarioSolicitante = usuarioSolicitante;
    }

    public String getUsuarioAsignado() {
        return usuarioAsignado;
    }

    public void setUsuarioAsignado(String usuarioAsignado) {
        this.usuarioAsignado = usuarioAsignado;
    }

    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
    }

    public boolean isPasoPorEnProceso() {
        return pasoPorEnProceso;
    }

    public void setPasoPorEnProceso(boolean pasoPorEnProceso) {
        this.pasoPorEnProceso = pasoPorEnProceso;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public int getSlaHorasMaximo() {
        return slaHorasMaximo;
    }

    public void setSlaHorasMaximo(int slaHorasMaximo) {
        this.slaHorasMaximo = slaHorasMaximo;
    }

    public long getMinutosTranscurridos() {
        return minutosTranscurridos;
    }

    public void setMinutosTranscurridos(long minutosTranscurridos) {
        this.minutosTranscurridos = minutosTranscurridos;
    }

    public String getEstadoSla() {
        return estadoSla;
    }

    public void setEstadoSla(String estadoSla) {
        this.estadoSla = estadoSla;
    }

    public List<EstadoSolicitud> getPosiblesSiguientesEstados() {
        return posiblesSiguientesEstados;
    }

    public void setPosiblesSiguientesEstados(List<EstadoSolicitud> posiblesSiguientesEstados) {
        this.posiblesSiguientesEstados = posiblesSiguientesEstados;
    }

    public List<HistorialTransicion> getHistorialAuditoria() {
        return historialAuditoria;
    }

    public void setHistorialAuditoria(List<HistorialTransicion> historialAuditoria) {
        this.historialAuditoria = historialAuditoria;
    }
}
