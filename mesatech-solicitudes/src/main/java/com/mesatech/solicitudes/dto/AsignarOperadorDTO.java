package com.mesatech.solicitudes.dto;

import jakarta.validation.constraints.NotBlank;

public class AsignarOperadorDTO {

    @NotBlank(message = "El usuario operador a asignar es obligatorio")
    private String usuarioOperador;

    private String asignadoPor;

    public AsignarOperadorDTO() {
    }

    public AsignarOperadorDTO(String usuarioOperador, String asignadoPor) {
        this.usuarioOperador = usuarioOperador;
        this.asignadoPor = asignadoPor;
    }

    public String getUsuarioOperador() {
        return usuarioOperador;
    }

    public void setUsuarioOperador(String usuarioOperador) {
        this.usuarioOperador = usuarioOperador;
    }

    public String getAsignadoPor() {
        return asignadoPor;
    }

    public void setAsignadoPor(String asignadoPor) {
        this.asignadoPor = asignadoPor;
    }
}
