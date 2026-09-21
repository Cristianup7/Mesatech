package com.mesatech.solicitudes.service;

import com.mesatech.solicitudes.dto.*;
import com.mesatech.solicitudes.exception.BusinessRuleException;
import com.mesatech.solicitudes.exception.ResourceNotFoundException;
import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.model.HistorialTransicion;
import com.mesatech.solicitudes.model.Solicitud;
import com.mesatech.solicitudes.repository.HistorialTransicionRepository;
import com.mesatech.solicitudes.repository.SolicitudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final HistorialTransicionRepository historialRepository;

    public SolicitudService(SolicitudRepository solicitudRepository, HistorialTransicionRepository historialRepository) {
        this.solicitudRepository = solicitudRepository;
        this.historialRepository = historialRepository;
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponseV1DTO> listarTodasV1(String usuarioSolicitante, String usuarioAsignado, EstadoSolicitud estado) {
        List<Solicitud> list;
        if (usuarioSolicitante != null && !usuarioSolicitante.isBlank()) {
            list = solicitudRepository.findByUsuarioSolicitanteOrderByFechaCreacionDesc(usuarioSolicitante);
        } else if (usuarioAsignado != null && !usuarioAsignado.isBlank()) {
            list = solicitudRepository.findByUsuarioAsignadoOrderByFechaCreacionDesc(usuarioAsignado);
        } else if (estado != null) {
            list = solicitudRepository.findByEstadoOrderByFechaCreacionDesc(estado);
        } else {
            list = solicitudRepository.findAllByOrderByFechaCreacionDesc();
        }
        return list.stream().map(SolicitudResponseV1DTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponseV2DTO> listarTodasV2(String usuarioSolicitante, String usuarioAsignado, EstadoSolicitud estado) {
        List<Solicitud> list;
        if (usuarioSolicitante != null && !usuarioSolicitante.isBlank()) {
            list = solicitudRepository.findByUsuarioSolicitanteOrderByFechaCreacionDesc(usuarioSolicitante);
        } else if (usuarioAsignado != null && !usuarioAsignado.isBlank()) {
            list = solicitudRepository.findByUsuarioAsignadoOrderByFechaCreacionDesc(usuarioAsignado);
        } else if (estado != null) {
            list = solicitudRepository.findByEstadoOrderByFechaCreacionDesc(estado);
        } else {
            list = solicitudRepository.findAllByOrderByFechaCreacionDesc();
        }

        return list.stream().map(s -> {
            List<EstadoSolicitud> siguientes = obtenerPosiblesSiguientesEstados(s);
            List<HistorialTransicion> historial = historialRepository.findBySolicitudIdOrderByFechaTransicionAsc(s.getId());
            return SolicitudResponseV2DTO.fromEntity(s, siguientes, historial);
        }).toList();
    }

    @Transactional(readOnly = true)
    public SolicitudResponseV1DTO obtenerPorIdV1(Long id) {
        Solicitud solicitud = buscarEntidad(id);
        return SolicitudResponseV1DTO.fromEntity(solicitud);
    }

    @Transactional(readOnly = true)
    public SolicitudResponseV2DTO obtenerPorIdV2(Long id) {
        Solicitud solicitud = buscarEntidad(id);
        List<EstadoSolicitud> siguientes = obtenerPosiblesSiguientesEstados(solicitud);
        List<HistorialTransicion> historial = historialRepository.findBySolicitudIdOrderByFechaTransicionAsc(solicitud.getId());
        return SolicitudResponseV2DTO.fromEntity(solicitud, siguientes, historial);
    }

    @Transactional
    public SolicitudResponseV1DTO crearSolicitud(SolicitudRequestDTO dto) {
        Solicitud solicitud = new Solicitud(
                dto.getTitulo(),
                dto.getDescripcion(),
                dto.getCategoria(),
                dto.getPrioridad(),
                dto.getUsuarioSolicitante()
        );
        solicitud.setEstado(EstadoSolicitud.CREADA);
        solicitud.setTuvoEnProceso(false);

        Solicitud guardada = solicitudRepository.save(solicitud);

        // Registro de auditoría inicial
        HistorialTransicion inicial = new HistorialTransicion(
                guardada.getId(),
                EstadoSolicitud.CREADA,
                EstadoSolicitud.CREADA,
                dto.getUsuarioSolicitante(),
                "Solicitud creada en el sistema"
        );
        historialRepository.save(inicial);

        return SolicitudResponseV1DTO.fromEntity(guardada);
    }

    @Transactional
    public SolicitudResponseV1DTO cambiarEstado(Long id, CambiarEstadoDTO dto) {
        Solicitud solicitud = buscarEntidad(id);
        EstadoSolicitud estadoActual = solicitud.getEstado();
        EstadoSolicitud nuevoEstado = dto.getNuevoEstado();

        validarTransicion(solicitud, estadoActual, nuevoEstado);

        // Si la solicitud entra en EN_PROCESO, marcamos la bandera obligatoria
        if (nuevoEstado == EstadoSolicitud.EN_PROCESO) {
            solicitud.setTuvoEnProceso(true);
        }

        solicitud.setEstado(nuevoEstado);
        solicitud.setFechaActualizacion(LocalDateTime.now());
        Solicitud actualizada = solicitudRepository.save(solicitud);

        // Guardar en historial de transiciones
        HistorialTransicion transicion = new HistorialTransicion(
                actualizada.getId(),
                estadoActual,
                nuevoEstado,
                dto.getUsuario(),
                dto.getObservacion() != null ? dto.getObservacion() : "Cambio de estado a " + nuevoEstado
        );
        historialRepository.save(transicion);

        return SolicitudResponseV1DTO.fromEntity(actualizada);
    }

    @Transactional
    public SolicitudResponseV1DTO asignarOperador(Long id, AsignarOperadorDTO dto) {
        Solicitud solicitud = buscarEntidad(id);
        EstadoSolicitud estadoActual = solicitud.getEstado();

        solicitud.setUsuarioAsignado(dto.getUsuarioOperador());

        // Si estaba en CREADA, al asignarse transiciona automáticamente a ASIGNADA
        if (estadoActual == EstadoSolicitud.CREADA) {
            solicitud.setEstado(EstadoSolicitud.ASIGNADA);
            solicitud.setFechaActualizacion(LocalDateTime.now());

            HistorialTransicion transicion = new HistorialTransicion(
                    solicitud.getId(),
                    estadoActual,
                    EstadoSolicitud.ASIGNADA,
                    dto.getAsignadoPor() != null ? dto.getAsignadoPor() : "sistema",
                    "Asignado al operador: " + dto.getUsuarioOperador()
            );
            historialRepository.save(transicion);
        }

        Solicitud guardada = solicitudRepository.save(solicitud);
        return SolicitudResponseV1DTO.fromEntity(guardada);
    }

    /**
     * Regla de negocio crítica del caso de uso:
     * CREADA -> ASIGNADA -> EN_PROCESO -> RESUELTA -> CERRADA (o CANCELADA).
     * Una solicitud NO PUEDE pasar a estado RESUELTA si antes no pasó por EN_PROCESO.
     */
    public void validarTransicion(Solicitud solicitud, EstadoSolicitud actual, EstadoSolicitud nuevo) {
        if (actual == nuevo) {
            throw new BusinessRuleException("La solicitud ya se encuentra en el estado " + actual);
        }

        if (actual == EstadoSolicitud.CERRADA || actual == EstadoSolicitud.CANCELADA) {
            throw new BusinessRuleException("No se puede modificar una solicitud que ya está en estado terminal (" + actual + ")");
        }

        // Validación crítica solicitada explícitamente en el caso de negocio:
        if (nuevo == EstadoSolicitud.RESUELTA) {
            if (!solicitud.isTuvoEnProceso() && actual != EstadoSolicitud.EN_PROCESO) {
                throw new BusinessRuleException("Regla de negocio infringida: Una solicitud no puede pasar a estado RESUELTA si antes no pasó por EN_PROCESO.");
            }
        }

        // Validación de flujo de estados permitidos
        switch (actual) {
            case CREADA -> {
                if (nuevo != EstadoSolicitud.ASIGNADA && nuevo != EstadoSolicitud.CANCELADA) {
                    throw new BusinessRuleException("Desde el estado CREADA solo se puede transicionar a ASIGNADA o CANCELADA. Intento inválido hacia: " + nuevo);
                }
            }
            case ASIGNADA -> {
                if (nuevo != EstadoSolicitud.EN_PROCESO && nuevo != EstadoSolicitud.CANCELADA) {
                    throw new BusinessRuleException("Desde el estado ASIGNADA solo se puede transicionar a EN_PROCESO o CANCELADA. Intento inválido hacia: " + nuevo);
                }
            }
            case EN_PROCESO -> {
                if (nuevo != EstadoSolicitud.RESUELTA && nuevo != EstadoSolicitud.CANCELADA) {
                    throw new BusinessRuleException("Desde el estado EN_PROCESO solo se puede transicionar a RESUELTA o CANCELADA. Intento inválido hacia: " + nuevo);
                }
            }
            case RESUELTA -> {
                if (nuevo != EstadoSolicitud.CERRADA) {
                    throw new BusinessRuleException("Desde el estado RESUELTA solo se puede transicionar a CERRADA. Intento inválido hacia: " + nuevo);
                }
            }
            default -> throw new BusinessRuleException("Transición no soportada desde el estado: " + actual);
        }
    }

    public List<EstadoSolicitud> obtenerPosiblesSiguientesEstados(Solicitud solicitud) {
        EstadoSolicitud actual = solicitud.getEstado();
        List<EstadoSolicitud> posibles = new ArrayList<>();
        switch (actual) {
            case CREADA -> {
                posibles.add(EstadoSolicitud.ASIGNADA);
                posibles.add(EstadoSolicitud.CANCELADA);
            }
            case ASIGNADA -> {
                posibles.add(EstadoSolicitud.EN_PROCESO);
                posibles.add(EstadoSolicitud.CANCELADA);
            }
            case EN_PROCESO -> {
                posibles.add(EstadoSolicitud.RESUELTA);
                posibles.add(EstadoSolicitud.CANCELADA);
            }
            case RESUELTA -> {
                posibles.add(EstadoSolicitud.CERRADA);
            }
            case CERRADA, CANCELADA -> {
                // Estados terminales
            }
        }
        return Collections.unmodifiableList(posibles);
    }

    private Solicitud buscarEntidad(Long id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud con id " + id + " no encontrada"));
    }
}
