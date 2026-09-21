-- ==========================================================
-- MesaTech Cloud - Microservicio 2: Catálogo de Soporte
-- Script DDL para Base de Datos MySQL
-- ==========================================================

CREATE DATABASE IF NOT EXISTS mesatech_catalogo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mesatech_catalogo_db;

DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS prioridades;

-- Tabla de Categorías de Soporte
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Prioridades de Soporte
CREATE TABLE prioridades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    nivel INT NOT NULL,
    tiempo_resolucion_horas INT NOT NULL,
    color_hex VARCHAR(10) NOT NULL DEFAULT '#6c757d',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
