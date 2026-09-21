package com.mesatech.catalogo.dto;

import com.mesatech.catalogo.model.Prioridad;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class PrioridadDTO {

    private Long id;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 30, message = "El código no puede superar 30 caracteres")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar 50 caracteres")
    private String nombre;

    @Min(value = 1, message = "El nivel mínimo es 1")
    @Max(value = 5, message = "El nivel máximo es 5")
    private int nivel;

    @Min(value = 1, message = "El tiempo de resolución debe ser de al menos 1 hora")
    private int tiempoResolucionHoras;

    private String colorHex = "#6c757d";
    private boolean activo = true;
    private LocalDateTime fechaCreacion;

    public PrioridadDTO() {
    }

    public static PrioridadDTO fromEntity(Prioridad entity) {
        PrioridadDTO dto = new PrioridadDTO();
        dto.setId(entity.getId());
        dto.setCodigo(entity.getCodigo());
        dto.setNombre(entity.getNombre());
        dto.setNivel(entity.getNivel());
        dto.setTiempoResolucionHoras(entity.getTiempoResolucionHoras());
        dto.setColorHex(entity.getColorHex());
        dto.setActivo(entity.isActivo());
        dto.setFechaCreacion(entity.getFechaCreacion());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getNivel() {
        return nivel;
    }

    public void setNivel(int nivel) {
        this.nivel = nivel;
    }

    public int getTiempoResolucionHoras() {
        return tiempoResolucionHoras;
    }

    public void setTiempoResolucionHoras(int tiempoResolucionHoras) {
        this.tiempoResolucionHoras = tiempoResolucionHoras;
    }

    public String getColorHex() {
        return colorHex;
    }

    public void setColorHex(String colorHex) {
        this.colorHex = colorHex;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
