package com.mesatech.solicitudes.repository;

import com.mesatech.solicitudes.model.HistorialTransicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialTransicionRepository extends JpaRepository<HistorialTransicion, Long> {
    List<HistorialTransicion> findBySolicitudIdOrderByFechaTransicionAsc(Long solicitudId);
}
