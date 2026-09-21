package com.mesatech.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class CatalogoClient {

    private final RestClient restClient;

    public CatalogoClient(@Value("${services.catalogo.url:http://localhost:8082}") String catalogoUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(catalogoUrl)
                .build();
    }

    // --- Categorías ---
    public Object listarCategorias(boolean soloActivas) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/catalogo/categorias")
                        .queryParam("soloActivas", soloActivas)
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public Object obtenerCategoria(Long id) {
        return restClient.get()
                .uri("/v1/catalogo/categorias/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public Object crearCategoria(Map<String, Object> body) {
        return restClient.post()
                .uri("/v1/catalogo/categorias")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public Object actualizarCategoria(Long id, Map<String, Object> body) {
        return restClient.put()
                .uri("/v1/catalogo/categorias/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public void eliminarCategoria(Long id) {
        restClient.delete()
                .uri("/v1/catalogo/categorias/{id}", id)
                .retrieve()
                .toBodilessEntity();
    }

    // --- Prioridades ---
    public Object listarPrioridades(boolean soloActivas) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/catalogo/prioridades")
                        .queryParam("soloActivas", soloActivas)
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public Object obtenerPrioridad(Long id) {
        return restClient.get()
                .uri("/v1/catalogo/prioridades/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public Object crearPrioridad(Map<String, Object> body) {
        return restClient.post()
                .uri("/v1/catalogo/prioridades")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public Object actualizarPrioridad(Long id, Map<String, Object> body) {
        return restClient.put()
                .uri("/v1/catalogo/prioridades/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Object>() {});
    }

    public void eliminarPrioridad(Long id) {
        restClient.delete()
                .uri("/v1/catalogo/prioridades/{id}", id)
                .retrieve()
                .toBodilessEntity();
    }
}
