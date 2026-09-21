package com.mesatech.bff.controller;

import com.mesatech.bff.client.CatalogoClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/catalogo")
public class BffCatalogoController {

    private final CatalogoClient catalogoClient;

    public BffCatalogoController(CatalogoClient catalogoClient) {
        this.catalogoClient = catalogoClient;
    }

    // --- Categorías ---
    @GetMapping("/categorias")
    public ResponseEntity<Object> listarCategorias(@RequestParam(defaultValue = "false") boolean soloActivas) {
        return ResponseEntity.ok(catalogoClient.listarCategorias(soloActivas));
    }

    @GetMapping("/categorias/{id}")
    public ResponseEntity<Object> obtenerCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(catalogoClient.obtenerCategoria(id));
    }

    @PostMapping("/categorias")
    public ResponseEntity<Object> crearCategoria(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoClient.crearCategoria(body));
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<Object> actualizarCategoria(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(catalogoClient.actualizarCategoria(id, body));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        catalogoClient.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }

    // --- Prioridades ---
    @GetMapping("/prioridades")
    public ResponseEntity<Object> listarPrioridades(@RequestParam(defaultValue = "false") boolean soloActivas) {
        return ResponseEntity.ok(catalogoClient.listarPrioridades(soloActivas));
    }

    @GetMapping("/prioridades/{id}")
    public ResponseEntity<Object> obtenerPrioridad(@PathVariable Long id) {
        return ResponseEntity.ok(catalogoClient.obtenerPrioridad(id));
    }

    @PostMapping("/prioridades")
    public ResponseEntity<Object> crearPrioridad(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoClient.crearPrioridad(body));
    }

    @PutMapping("/prioridades/{id}")
    public ResponseEntity<Object> actualizarPrioridad(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(catalogoClient.actualizarPrioridad(id, body));
    }

    @DeleteMapping("/prioridades/{id}")
    public ResponseEntity<Void> eliminarPrioridad(@PathVariable Long id) {
        catalogoClient.eliminarPrioridad(id);
        return ResponseEntity.noContent().build();
    }
}
