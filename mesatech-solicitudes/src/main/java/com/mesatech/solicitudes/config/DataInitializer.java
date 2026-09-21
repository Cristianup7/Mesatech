package com.mesatech.solicitudes.config;

import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.model.HistorialTransicion;
import com.mesatech.solicitudes.model.Solicitud;
import com.mesatech.solicitudes.repository.HistorialTransicionRepository;
import com.mesatech.solicitudes.repository.SolicitudRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SolicitudRepository solicitudRepository;
    private final HistorialTransicionRepository historialRepository;

    public DataInitializer(SolicitudRepository solicitudRepository, HistorialTransicionRepository historialRepository) {
        this.solicitudRepository = solicitudRepository;
        this.historialRepository = historialRepository;
    }

    @Override
    public void run(String... args) {
        if (solicitudRepository.count() == 0) {
            // Solicitud 1: CREADA
            Solicitud s1 = new Solicitud(
                    "Instalación de herramientas de desarrollo",
                    "Requiero JDK 17, Docker Desktop y Git configurado en mi estación",
                    "Software y Aplicaciones",
                    "Baja",
                    "cliente@mesatech.cloud"
            );
            s1.setEstado(EstadoSolicitud.CREADA);
            s1.setFechaCreacion(LocalDateTime.now().minusHours(5));
            s1 = solicitudRepository.save(s1);
            historialRepository.save(new HistorialTransicion(s1.getId(), EstadoSolicitud.CREADA, EstadoSolicitud.CREADA, "cliente@mesatech.cloud", "Solicitud inicial creada"));

            // Solicitud 2: ASIGNADA
            Solicitud s2 = new Solicitud(
                    "Solicitud de teclado mecánico ergonómico",
                    "Problemas de tendinitis, se adjunta indicación de ergonomía",
                    "Hardware y Equipamiento",
                    "Media",
                    "cliente@mesatech.cloud"
            );
            s2.setUsuarioAsignado("operador@mesatech.cloud");
            s2.setEstado(EstadoSolicitud.ASIGNADA);
            s2.setFechaCreacion(LocalDateTime.now().minusDays(1));
            s2 = solicitudRepository.save(s2);
            historialRepository.save(new HistorialTransicion(s2.getId(), EstadoSolicitud.CREADA, EstadoSolicitud.ASIGNADA, "admin@mesatech.cloud", "Asignado a operador técnico"));

            // Solicitud 3: EN_PROCESO
            Solicitud s3 = new Solicitud(
                    "Falla intermitente en túnel VPN",
                    "La conexión se cae cada 10 minutos al acceder a bases de datos en AWS",
                    "Redes y Conectividad",
                    "Alta",
                    "cliente@mesatech.cloud"
            );
            s3.setUsuarioAsignado("operador@mesatech.cloud");
            s3.setEstado(EstadoSolicitud.EN_PROCESO);
            s3.setTuvoEnProceso(true);
            s3.setFechaCreacion(LocalDateTime.now().minusHours(4));
            s3 = solicitudRepository.save(s3);
            historialRepository.save(new HistorialTransicion(s3.getId(), EstadoSolicitud.CREADA, EstadoSolicitud.ASIGNADA, "admin@mesatech.cloud", "Asignado"));
            historialRepository.save(new HistorialTransicion(s3.getId(), EstadoSolicitud.ASIGNADA, EstadoSolicitud.EN_PROCESO, "operador@mesatech.cloud", "Iniciando diagnóstico en firewall"));

            // Solicitud 4: RESUELTA (Pasó válidamente por EN_PROCESO)
            Solicitud s4 = new Solicitud(
                    "Bloqueo de cuenta en Directorio Activo",
                    "Intentos fallidos de contraseña tras regreso de vacaciones",
                    "Accesos y Credenciales",
                    "Crítica",
                    "carlos.gomez@mesatech.cloud"
            );
            s4.setUsuarioAsignado("operador@mesatech.cloud");
            s4.setEstado(EstadoSolicitud.RESUELTA);
            s4.setTuvoEnProceso(true);
            s4.setFechaCreacion(LocalDateTime.now().minusHours(1));
            s4 = solicitudRepository.save(s4);
            historialRepository.save(new HistorialTransicion(s4.getId(), EstadoSolicitud.CREADA, EstadoSolicitud.ASIGNADA, "admin@mesatech.cloud", "Asignado"));
            historialRepository.save(new HistorialTransicion(s4.getId(), EstadoSolicitud.ASIGNADA, EstadoSolicitud.EN_PROCESO, "operador@mesatech.cloud", "Desbloqueando en consola AD"));
            historialRepository.save(new HistorialTransicion(s4.getId(), EstadoSolicitud.EN_PROCESO, EstadoSolicitud.RESUELTA, "operador@mesatech.cloud", "Cuenta desbloqueada exitosamente"));
        }
    }
}
