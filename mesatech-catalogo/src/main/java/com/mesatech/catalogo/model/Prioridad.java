package com.mesatech.catalogo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prioridades")
public class Prioridad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String codigo;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false)
    private int nivel; // 1: Baja, 2: Media, 3: Alta, 4: Crítica

    @Column(name = "tiempo_resolucion_horas", nullable = false)
    private int tiempoResolucionHoras;

    @Column(name = "color_hex", length = 10)
    private String colorHex = "#6c757d";

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    public Prioridad() {
    }

    public Prioridad(String codigo, String nombre, int nivel, int tiempoResolucionHoras, String colorHex, boolean activo) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.nivel = nivel;
        this.tiempoResolucionHoras = tiempoResolucionHoras;
        this.colorHex = colorHex;
        this.activo = activo;
        this.fechaCreacion = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDateTime.now();
        }
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
