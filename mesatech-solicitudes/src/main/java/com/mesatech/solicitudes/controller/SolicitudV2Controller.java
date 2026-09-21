package com.mesatech.solicitudes.controller;

import com.mesatech.solicitudes.dto.SolicitudResponseV2DTO;
import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.service.SolicitudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v2/solicitudes")
public class SolicitudV2Controller {

    private final SolicitudService solicitudService;

    public SolicitudV2Controller(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @GetMapping
    public ResponseEntity<List<SolicitudResponseV2DTO>> listarSolicitudesV2(
            @RequestParam(required = false) String usuarioSolicitante,
            @RequestParam(required = false) String usuarioAsignado,
            @RequestParam(required = false) EstadoSolicitud estado) {
        return ResponseEntity.ok(solicitudService.listarTodasV2(usuarioSolicitante, usuarioAsignado, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudResponseV2DTO> obtenerPorIdV2(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.obtenerPorIdV2(id));
    }
}
