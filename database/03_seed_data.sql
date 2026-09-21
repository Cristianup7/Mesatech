-- ==========================================================
-- MesaTech Cloud - Datos Semilla Iniciales
-- Carga de Categorías, Prioridades y Solicitudes de Prueba
-- ==========================================================

-- Semillas para Catálogo
USE mesatech_catalogo_db;

INSERT INTO categorias (codigo, nombre, descripcion, activo) VALUES
('HW', 'Hardware y Equipamiento', 'Fallas en laptops, monitores, periféricos y partes físicas', TRUE),
('SW', 'Software y Aplicaciones', 'Problemas con sistemas operativos, suites ofimáticas y software corporativo', TRUE),
('NET', 'Redes y Conectividad', 'Dificultades de acceso VPN, Wi-Fi institucional y navegación interna', TRUE),
('ACC', 'Accesos y Credenciales', 'Gestión de cuentas de dominio, restablecimiento de contraseñas y permisos', TRUE),
('SEG', 'Seguridad de la Información', 'Reporte de incidentes de seguridad, correos sospechosos y antivirus', TRUE);

INSERT INTO prioridades (codigo, nombre, nivel, tiempo_resolucion_horas, color_hex, activo) VALUES
('BAJA', 'Baja', 1, 48, '#28a745', TRUE),
('MEDIA', 'Media', 2, 24, '#ffc107', TRUE),
('ALTA', 'Alta', 3, 8, '#fd7e14', TRUE),
('CRITICA', 'Crítica', 4, 2, '#dc3545', TRUE);

-- Semillas para Solicitudes
USE mesatech_solicitudes_db;

INSERT INTO solicitudes (titulo, descripcion, categoria, prioridad, usuario_solicitante, usuario_asignado, estado, tuvo_en_proceso, fecha_creacion) VALUES
('Solicitud de monitor secundario', 'Requiero un segundo monitor para labores de desarrollo y análisis de datos', 'Hardware y Equipamiento', 'Media', 'cliente@mesatech.cloud', 'operador@mesatech.cloud', 'ASIGNADA', FALSE, NOW() - INTERVAL 2 DAY),
('Falla de conexión VPN corporativa', 'No logro autenticarme al túnel VPN desde teletrabajo, arroja error 619', 'Redes y Conectividad', 'Alta', 'cliente@mesatech.cloud', 'operador@mesatech.cloud', 'EN_PROCESO', TRUE, NOW() - INTERVAL 1 DAY),
('Bloqueo de contraseña en ERP', 'He intentado 3 veces y mi cuenta quedó bloqueada por políticas', 'Accesos y Credenciales', 'Crítica', 'cliente.dos@mesatech.cloud', 'operador@mesatech.cloud', 'RESUELTA', TRUE, NOW() - INTERVAL 3 HOUR),
('Instalación de IntelliJ IDEA Ultimate', 'Licencia asignada, se requiere instalación y configuración de variables', 'Software y Aplicaciones', 'Baja', 'cliente@mesatech.cloud', NULL, 'CREADA', FALSE, NOW() - INTERVAL 30 MINUTE);

-- Historial para la solicitud en RESUELTA
INSERT INTO historial_transiciones (solicitud_id, estado_anterior, estado_nuevo, usuario, observacion, fecha_transicion) VALUES
(3, 'CREADA', 'ASIGNADA', 'sistema', 'Asignación automática inicial', NOW() - INTERVAL 3 HOUR),
(3, 'ASIGNADA', 'EN_PROCESO', 'operador@mesatech.cloud', 'Atendiendo desbloqueo en consola Active Directory', NOW() - INTERVAL 2 HOUR),
(3, 'EN_PROCESO', 'RESUELTA', 'operador@mesatech.cloud', 'Cuenta desbloqueada y contraseña temporal provista', NOW() - INTERVAL 30 MINUTE);
