package com.mesatech.catalogo;

import com.mesatech.catalogo.dto.CategoriaDTO;
import com.mesatech.catalogo.dto.PrioridadDTO;
import com.mesatech.catalogo.exception.DuplicateResourceException;
import com.mesatech.catalogo.service.CatalogoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CatalogoCrudTest {

    @Autowired
    private CatalogoService catalogoService;

    @Test
    @DisplayName("Debe listar las categorías semilla iniciales")
    void testListarCategorias() {
        List<CategoriaDTO> categorias = catalogoService.listarCategorias(false);
        assertNotNull(categorias);
        assertFalse(categorias.isEmpty());
        assertTrue(categorias.stream().anyMatch(c -> c.getCodigo().equals("HW")));
    }

    @Test
    @DisplayName("Debe listar las prioridades con sus tiempos SLA")
    void testListarPrioridades() {
        List<PrioridadDTO> prioridades = catalogoService.listarPrioridades(false);
        assertNotNull(prioridades);
        assertEquals(4, prioridades.size());
    }

    @Test
    @DisplayName("CRUD de Categoría: Crear, actualizar y desactivar")
    void testCrudCategoria() {
        CategoriaDTO nueva = new CategoriaDTO();
        nueva.setCodigo("TEST_CAT");
        nueva.setNombre("Categoría de Prueba");
        nueva.setDescripcion("Para testing unitario");
        nueva.setActivo(true);

        CategoriaDTO creada = catalogoService.crearCategoria(nueva);
        assertNotNull(creada.getId());
        assertEquals("TEST_CAT", creada.getCodigo());

        // Actualizar
        creada.setNombre("Categoría Modificada");
        CategoriaDTO actualizada = catalogoService.actualizarCategoria(creada.getId(), creada);
        assertEquals("Categoría Modificada", actualizada.getNombre());

        // Desactivación lógica
        catalogoService.eliminarCategoria(creada.getId());
        CategoriaDTO desactivada = catalogoService.obtenerCategoriaPorId(creada.getId());
        assertFalse(desactivada.isActivo());
    }

    @Test
    @DisplayName("Debe rechazar categoría con código duplicado")
    void testRechazarCodigoDuplicado() {
        CategoriaDTO duplicada = new CategoriaDTO();
        duplicada.setCodigo("HW"); // Código ya existente en semillas
        duplicada.setNombre("Hardware duplicado");

        assertThrows(DuplicateResourceException.class, () -> {
            catalogoService.crearCategoria(duplicada);
        });
    }
}
