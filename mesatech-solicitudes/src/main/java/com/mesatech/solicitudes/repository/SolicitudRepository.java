package com.mesatech.solicitudes.repository;

import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByUsuarioSolicitanteOrderByFechaCreacionDesc(String usuarioSolicitante);
    List<Solicitud> findByUsuarioAsignadoOrderByFechaCreacionDesc(String usuarioAsignado);
    List<Solicitud> findByEstadoOrderByFechaCreacionDesc(EstadoSolicitud estado);
    List<Solicitud> findAllByOrderByFechaCreacionDesc();
}
