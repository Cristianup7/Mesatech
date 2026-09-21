-- ==========================================================
-- MesaTech Cloud - Microservicio 1: Gestión de Solicitudes
-- Script DDL para Base de Datos MySQL
-- ==========================================================

CREATE DATABASE IF NOT EXISTS mesatech_solicitudes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mesatech_solicitudes_db;

DROP TABLE IF EXISTS historial_transiciones;
DROP TABLE IF EXISTS solicitudes;

-- Tabla principal de Solicitudes
CREATE TABLE solicitudes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    usuario_solicitante VARCHAR(100) NOT NULL,
    usuario_asignado VARCHAR(100) NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'CREADA',
    tuvo_en_proceso BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario_solicitante (usuario_solicitante),
    INDEX idx_usuario_asignado (usuario_asignado),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para traza histórica de transiciones de estado
CREATE TABLE historial_transiciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id BIGINT NOT NULL,
    estado_anterior VARCHAR(30) NOT NULL,
    estado_nuevo VARCHAR(30) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    observacion VARCHAR(255) NULL,
    fecha_transicion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
