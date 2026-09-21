package com.mesatech.solicitudes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_transiciones")
public class HistorialTransicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "solicitud_id", nullable = false)
    private Long solicitudId;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior", nullable = false, length = 30)
    private EstadoSolicitud estadoAnterior;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false, length = 30)
    private EstadoSolicitud estadoNuevo;

    @Column(nullable = false, length = 100)
    private String usuario;

    @Column(length = 255)
    private String observacion;

    @Column(name = "fecha_transicion", nullable = false)
    private LocalDateTime fechaTransicion;

    public HistorialTransicion() {
    }

    public HistorialTransicion(Long solicitudId, EstadoSolicitud estadoAnterior, EstadoSolicitud estadoNuevo, String usuario, String observacion) {
        this.solicitudId = solicitudId;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.usuario = usuario;
        this.observacion = observacion;
        this.fechaTransicion = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaTransicion == null) {
            this.fechaTransicion = LocalDateTime.now();
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSolicitudId() {
        return solicitudId;
    }

    public void setSolicitudId(Long solicitudId) {
        this.solicitudId = solicitudId;
    }

    public EstadoSolicitud getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(EstadoSolicitud estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public EstadoSolicitud getEstadoNuevo() {
        return estadoNuevo;
    }

    public void setEstadoNuevo(EstadoSolicitud estadoNuevo) {
        this.estadoNuevo = estadoNuevo;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public LocalDateTime getFechaTransicion() {
        return fechaTransicion;
    }

    public void setFechaTransicion(LocalDateTime fechaTransicion) {
        this.fechaTransicion = fechaTransicion;
    }
}
