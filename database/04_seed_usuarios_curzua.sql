-- ==========================================================
-- MesaTech Cloud - Datos de Prueba para Cuentas Institucionales
-- Tenant: curzua1.onmicrosoft.com
-- Usuarios:
--   - Juan Cliente: cliente.prueba@curzua1.onmicrosoft.com
--   - Carlos Operador: operador.prueba@curzua1.onmicrosoft.com
--   - Andrés Administrador: admin.prueba@curzua1.onmicrosoft.com
-- ==========================================================

USE mesatech_catalogo_db;

-- Asegurar categorías base
INSERT IGNORE INTO categorias (id, codigo, nombre, descripcion, activo, fecha_creacion) VALUES
(1, 'HW', 'Hardware y Equipamiento', 'Fallas en laptops, monitores, periféricos y partes físicas', TRUE, NOW()),
(2, 'SW', 'Software y Aplicaciones', 'Problemas con sistemas operativos, suites ofimáticas y software corporativo', TRUE, NOW()),
(3, 'NET', 'Redes y Conectividad', 'Dificultades de acceso VPN, Wi-Fi institucional y navegación interna', TRUE, NOW()),
(4, 'ACC', 'Accesos y Credenciales', 'Gestión de cuentas de dominio, restablecimiento de contraseñas y permisos', TRUE, NOW()),
(5, 'SEG', 'Seguridad de la Información', 'Reporte de incidentes de seguridad, correos sospechosos y antivirus', TRUE, NOW());

-- Asegurar prioridades base con tiempos SLA
INSERT IGNORE INTO prioridades (id, codigo, nombre, nivel, tiempo_resolucion_horas, color_hex, activo, fecha_creacion) VALUES
(1, 'BAJA', 'Baja', 1, 48, '#16a34a', TRUE, NOW()),
(2, 'MEDIA', 'Media', 2, 24, '#0284c7', TRUE, NOW()),
(3, 'ALTA', 'Alta', 3, 8, '#ea580c', TRUE, NOW()),
(4, 'CRITICA', 'Crítica', 4, 2, '#dc2626', TRUE, NOW());

USE mesatech_solicitudes_db;

-- Solicitudes de prueba representativas para los 3 perfiles
INSERT INTO solicitudes (id, titulo, descripcion, categoria, prioridad, usuario_solicitante, usuario_asignado, estado, tuvo_en_proceso, fecha_creacion, fecha_actualizacion) VALUES
(10, 'Falla en acceso a suite Microsoft 365 y Teams', 'No puedo ingresar a Teams con la cuenta cliente.prueba, indica error de sincronización de licencias.', 'Software y Aplicaciones', 'Alta', 'cliente.prueba@curzua1.onmicrosoft.com', NULL, 'CREADA', FALSE, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),
(11, 'Solicitud de monitor secundario para teletrabajo', 'Se requiere monitor FHD de 24 pulgadas y adaptador HDMI para labores de análisis.', 'Hardware y Equipamiento', 'Media', 'cliente.prueba@curzua1.onmicrosoft.com', 'operador.prueba@curzua1.onmicrosoft.com', 'ASIGNADA', FALSE, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 2 HOUR),
(12, 'Problema con certificado VPN institucional', 'El túnel VPN corporativo desconecta cada 10 minutos por expiración de certificado de cliente.', 'Redes y Conectividad', 'Alta', 'cliente.prueba@curzua1.onmicrosoft.com', 'operador.prueba@curzua1.onmicrosoft.com', 'EN_PROCESO', TRUE, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 3 HOUR),
(13, 'Desbloqueo de clave y enrolamiento MFA', 'Bloqueo temporal por intentos fallidos tras cambio periódico de contraseña institucional.', 'Accesos y Credenciales', 'Crítica', 'cliente.prueba@curzua1.onmicrosoft.com', 'operador.prueba@curzua1.onmicrosoft.com', 'RESUELTA', TRUE, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 6 HOUR),
(14, 'Renovación de licencia antivirus corporativo', 'Licencia expirada en laptop asignada para trabajo remoto.', 'Seguridad de la Información', 'Baja', 'cliente.prueba@curzua1.onmicrosoft.com', 'operador.prueba@curzua1.onmicrosoft.com', 'CERRADA', TRUE, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY),
(15, 'Actualización de memoria RAM a 32GB', 'Requerimiento de ampliación de memoria para virtualización de contenedores Docker.', 'Hardware y Equipamiento', 'Media', 'admin.prueba@curzua1.onmicrosoft.com', 'operador.prueba@curzua1.onmicrosoft.com', 'ASIGNADA', FALSE, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 4 HOUR)
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), estado = VALUES(estado);

-- Historial de auditoría para trazabilidad en v2
INSERT INTO historial_transiciones (solicitud_id, estado_anterior, estado_nuevo, usuario, observacion, fecha_transicion) VALUES
(10, 'CREADA', 'CREADA', 'cliente.prueba@curzua1.onmicrosoft.com', 'Solicitud registrada en plataforma MesaTech Cloud', NOW() - INTERVAL 1 HOUR),
(11, 'CREADA', 'CREADA', 'cliente.prueba@curzua1.onmicrosoft.com', 'Solicitud registrada en plataforma', NOW() - INTERVAL 5 HOUR),
(11, 'CREADA', 'ASIGNADA', 'operador.prueba@curzua1.onmicrosoft.com', 'Asignada al operador Carlos Operador para revisión técnica', NOW() - INTERVAL 2 HOUR),
(12, 'CREADA', 'ASIGNADA', 'sistema', 'Asignación automática de ticket', NOW() - INTERVAL 1 DAY),
(12, 'ASIGNADA', 'EN_PROCESO', 'operador.prueba@curzua1.onmicrosoft.com', 'Iniciando diagnóstico de logs de conexión VPN', NOW() - INTERVAL 3 HOUR),
(13, 'CREADA', 'ASIGNADA', 'sistema', 'Asignación por prioridad Crítica', NOW() - INTERVAL 2 DAY),
(13, 'ASIGNADA', 'EN_PROCESO', 'operador.prueba@curzua1.onmicrosoft.com', 'Validando identidad del solicitante en consola Active Directory', NOW() - INTERVAL 1 DAY),
(13, 'EN_PROCESO', 'RESUELTA', 'operador.prueba@curzua1.onmicrosoft.com', 'Clave restablecida y método MFA reconfigurado con éxito', NOW() - INTERVAL 6 HOUR),
(14, 'CREADA', 'ASIGNADA', 'sistema', 'Asignación inicial', NOW() - INTERVAL 3 DAY),
(14, 'ASIGNADA', 'EN_PROCESO', 'operador.prueba@curzua1.onmicrosoft.com', 'Despliegue de política de antivirus mediante Endpoint Manager', NOW() - INTERVAL 2 DAY),
(14, 'EN_PROCESO', 'RESUELTA', 'operador.prueba@curzua1.onmicrosoft.com', 'Antivirus actualizado y firma de virus al día', NOW() - INTERVAL 1 DAY),
(14, 'RESUELTA', 'CERRADA', 'cliente.prueba@curzua1.onmicrosoft.com', 'Cliente confirma recepción y correcto funcionamiento', NOW() - INTERVAL 1 DAY);
