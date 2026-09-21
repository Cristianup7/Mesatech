package com.mesatech.catalogo.service;

import com.mesatech.catalogo.dto.CategoriaDTO;
import com.mesatech.catalogo.dto.PrioridadDTO;
import com.mesatech.catalogo.exception.DuplicateResourceException;
import com.mesatech.catalogo.exception.ResourceNotFoundException;
import com.mesatech.catalogo.model.Categoria;
import com.mesatech.catalogo.model.Prioridad;
import com.mesatech.catalogo.repository.CategoriaRepository;
import com.mesatech.catalogo.repository.PrioridadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogoService {

    private final CategoriaRepository categoriaRepository;
    private final PrioridadRepository prioridadRepository;

    public CatalogoService(CategoriaRepository categoriaRepository, PrioridadRepository prioridadRepository) {
        this.categoriaRepository = categoriaRepository;
        this.prioridadRepository = prioridadRepository;
    }

    // --- CRUD Categorías ---
    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarCategorias(boolean soloActivas) {
        List<Categoria> list = soloActivas ? categoriaRepository.findByActivoTrue() : categoriaRepository.findAll();
        return list.stream().map(CategoriaDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDTO obtenerCategoriaPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + id + " no encontrada"));
        return CategoriaDTO.fromEntity(categoria);
    }

    @Transactional
    public CategoriaDTO crearCategoria(CategoriaDTO dto) {
        if (categoriaRepository.existsByCodigo(dto.getCodigo())) {
            throw new DuplicateResourceException("Ya existe una categoría con el código: " + dto.getCodigo());
        }
        Categoria entity = new Categoria(dto.getCodigo(), dto.getNombre(), dto.getDescripcion(), dto.isActivo());
        Categoria guardada = categoriaRepository.save(entity);
        return CategoriaDTO.fromEntity(guardada);
    }

    @Transactional
    public CategoriaDTO actualizarCategoria(Long id, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + id + " no encontrada"));

        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        categoria.setActivo(dto.isActivo());
        Categoria actualizada = categoriaRepository.save(categoria);
        return CategoriaDTO.fromEntity(actualizada);
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con id " + id + " no encontrada"));
        // Desactivación lógica para preservar integridad referencial de solicitudes existentes
        categoria.setActivo(false);
        categoriaRepository.save(categoria);
    }

    // --- CRUD Prioridades ---
    @Transactional(readOnly = true)
    public List<PrioridadDTO> listarPrioridades(boolean soloActivas) {
        List<Prioridad> list = soloActivas ? prioridadRepository.findByActivoTrueOrderByNivelAsc() : prioridadRepository.findAllByOrderByNivelAsc();
        return list.stream().map(PrioridadDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public PrioridadDTO obtenerPrioridadPorId(Long id) {
        Prioridad prioridad = prioridadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad con id " + id + " no encontrada"));
        return PrioridadDTO.fromEntity(prioridad);
    }

    @Transactional
    public PrioridadDTO crearPrioridad(PrioridadDTO dto) {
        if (prioridadRepository.existsByCodigo(dto.getCodigo())) {
            throw new DuplicateResourceException("Ya existe una prioridad con el código: " + dto.getCodigo());
        }
        Prioridad entity = new Prioridad(
                dto.getCodigo(),
                dto.getNombre(),
                dto.getNivel(),
                dto.getTiempoResolucionHoras(),
                dto.getColorHex() != null ? dto.getColorHex() : "#6c757d",
                dto.isActivo()
        );
        Prioridad guardada = prioridadRepository.save(entity);
        return PrioridadDTO.fromEntity(guardada);
    }

    @Transactional
    public PrioridadDTO actualizarPrioridad(Long id, PrioridadDTO dto) {
        Prioridad prioridad = prioridadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad con id " + id + " no encontrada"));

        prioridad.setNombre(dto.getNombre());
        prioridad.setNivel(dto.getNivel());
        prioridad.setTiempoResolucionHoras(dto.getTiempoResolucionHoras());
        if (dto.getColorHex() != null) {
            prioridad.setColorHex(dto.getColorHex());
        }
        prioridad.setActivo(dto.isActivo());
        Prioridad actualizada = prioridadRepository.save(prioridad);
        return PrioridadDTO.fromEntity(actualizada);
    }

    @Transactional
    public void eliminarPrioridad(Long id) {
        Prioridad prioridad = prioridadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad con id " + id + " no encontrada"));
        // Desactivación lógica
        prioridad.setActivo(false);
        prioridadRepository.save(prioridad);
    }
}
