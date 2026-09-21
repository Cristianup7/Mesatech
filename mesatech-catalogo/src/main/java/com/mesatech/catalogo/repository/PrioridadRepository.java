package com.mesatech.catalogo.repository;

import com.mesatech.catalogo.model.Prioridad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrioridadRepository extends JpaRepository<Prioridad, Long> {
    List<Prioridad> findByActivoTrueOrderByNivelAsc();
    List<Prioridad> findAllByOrderByNivelAsc();
    Optional<Prioridad> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
