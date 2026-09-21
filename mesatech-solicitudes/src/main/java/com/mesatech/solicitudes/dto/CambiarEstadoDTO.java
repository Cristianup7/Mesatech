package com.mesatech.solicitudes.dto;

import com.mesatech.solicitudes.model.EstadoSolicitud;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CambiarEstadoDTO {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoSolicitud nuevoEstado;

    @NotBlank(message = "El usuario que realiza la acción es obligatorio")
    private String usuario;

    private String observacion;

    public CambiarEstadoDTO() {
    }

    public CambiarEstadoDTO(EstadoSolicitud nuevoEstado, String usuario, String observacion) {
        this.nuevoEstado = nuevoEstado;
        this.usuario = usuario;
        this.observacion = observacion;
    }

    public EstadoSolicitud getNuevoEstado() {
        return nuevoEstado;
    }

    public void setNuevoEstado(EstadoSolicitud nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
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
}
