package com.mesatech.catalogo.service;

import com.mesatech.catalogo.dto.CategoriaDTO;
import com.mesatech.catalogo.dto.PrioridadDTO;
import com.mesatech.catalogo.exception.DuplicateResourceException;
import com.mesatech.catalogo.model.Categoria;
import com.mesatech.catalogo.model.Prioridad;
import com.mesatech.catalogo.repository.CategoriaRepository;
import com.mesatech.catalogo.repository.PrioridadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CatalogoServiceUnitTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private PrioridadRepository prioridadRepository;

    private CatalogoService service;

    @BeforeEach
    void setUp() {
        service = new CatalogoService(categoriaRepository, prioridadRepository);
    }

    @Test
    void crearCategoriaRechazaCodigoDuplicado() {
        CategoriaDTO dto = categoria("HW", "Hardware");
        when(categoriaRepository.existsByCodigo("HW")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> service.crearCategoria(dto));
    }

    @Test
    void crearCategoriaMapeaYGuardaLaEntidad() {
        CategoriaDTO dto = categoria("SW", "Software");
        when(categoriaRepository.existsByCodigo("SW")).thenReturn(false);
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(invocation -> {
            Categoria saved = invocation.getArgument(0);
            saved.setId(7L);
            return saved;
        });

        CategoriaDTO result = service.crearCategoria(dto);

        assertEquals(7L, result.getId());
        assertEquals("SW", result.getCodigo());
        assertEquals("Software", result.getNombre());
        verify(categoriaRepository).save(any(Categoria.class));
    }

    @Test
    void eliminarCategoriaRealizaDesactivacionLogica() {
        Categoria categoria = new Categoria("HW", "Hardware", "Equipos", true);
        categoria.setId(3L);
        when(categoriaRepository.findById(3L)).thenReturn(Optional.of(categoria));

        service.eliminarCategoria(3L);

        assertFalse(categoria.isActivo());
        verify(categoriaRepository).save(categoria);
    }

    @Test
    void crearPrioridadUsaColorPorDefectoCuandoNoSeIndica() {
        PrioridadDTO dto = prioridad("ALTA", "Alta", 3, 8);
        dto.setColorHex(null);
        when(prioridadRepository.existsByCodigo("ALTA")).thenReturn(false);
        when(prioridadRepository.save(any(Prioridad.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PrioridadDTO result = service.crearPrioridad(dto);

        assertEquals("#6c757d", result.getColorHex());
        assertEquals(3, result.getNivel());
        assertEquals(8, result.getTiempoResolucionHoras());
    }

    private static CategoriaDTO categoria(String codigo, String nombre) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setCodigo(codigo);
        dto.setNombre(nombre);
        dto.setActivo(true);
        return dto;
    }

    private static PrioridadDTO prioridad(String codigo, String nombre, int nivel, int horas) {
        PrioridadDTO dto = new PrioridadDTO();
        dto.setCodigo(codigo);
        dto.setNombre(nombre);
        dto.setNivel(nivel);
        dto.setTiempoResolucionHoras(horas);
        dto.setActivo(true);
        return dto;
    }
}
