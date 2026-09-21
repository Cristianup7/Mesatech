package com.mesatech.solicitudes.service;

import com.mesatech.solicitudes.exception.BusinessRuleException;
import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.model.Solicitud;
import com.mesatech.solicitudes.repository.HistorialTransicionRepository;
import com.mesatech.solicitudes.repository.SolicitudRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class SolicitudServiceUnitTest {

    @Mock
    private SolicitudRepository solicitudRepository;

    @Mock
    private HistorialTransicionRepository historialRepository;

    private SolicitudService service;

    @BeforeEach
    void setUp() {
        service = new SolicitudService(solicitudRepository, historialRepository);
    }

    @Test
    void flujoValidoPermiteLlegarACerrada() {
        Solicitud solicitud = solicitud(EstadoSolicitud.CREADA, false);

        service.validarTransicion(solicitud, EstadoSolicitud.CREADA, EstadoSolicitud.ASIGNADA);
        solicitud.setEstado(EstadoSolicitud.ASIGNADA);
        service.validarTransicion(solicitud, EstadoSolicitud.ASIGNADA, EstadoSolicitud.EN_PROCESO);
        solicitud.setEstado(EstadoSolicitud.EN_PROCESO);
        solicitud.setTuvoEnProceso(true);
        service.validarTransicion(solicitud, EstadoSolicitud.EN_PROCESO, EstadoSolicitud.RESUELTA);
        solicitud.setEstado(EstadoSolicitud.RESUELTA);

        service.validarTransicion(solicitud, EstadoSolicitud.RESUELTA, EstadoSolicitud.CERRADA);
    }

    @Test
    void noPermiteResolverSinPasarPorEnProceso() {
        Solicitud solicitud = solicitud(EstadoSolicitud.ASIGNADA, false);

        assertThrows(BusinessRuleException.class,
                () -> service.validarTransicion(solicitud, EstadoSolicitud.ASIGNADA, EstadoSolicitud.RESUELTA));
    }

    @Test
    void noPermiteModificarEstadosTerminales() {
        Solicitud cerrada = solicitud(EstadoSolicitud.CERRADA, true);
        Solicitud cancelada = solicitud(EstadoSolicitud.CANCELADA, false);

        assertThrows(BusinessRuleException.class,
                () -> service.validarTransicion(cerrada, EstadoSolicitud.CERRADA, EstadoSolicitud.CREADA));
        assertThrows(BusinessRuleException.class,
                () -> service.validarTransicion(cancelada, EstadoSolicitud.CANCELADA, EstadoSolicitud.CREADA));
    }

    @Test
    void obtenerPosiblesSiguientesEstadosDevuelveElFlujoEsperado() {
        assertEquals(List.of(EstadoSolicitud.ASIGNADA, EstadoSolicitud.CANCELADA),
                service.obtenerPosiblesSiguientesEstados(solicitud(EstadoSolicitud.CREADA, false)));
        assertEquals(List.of(EstadoSolicitud.EN_PROCESO, EstadoSolicitud.CANCELADA),
                service.obtenerPosiblesSiguientesEstados(solicitud(EstadoSolicitud.ASIGNADA, false)));
        assertEquals(List.of(EstadoSolicitud.RESUELTA, EstadoSolicitud.CANCELADA),
                service.obtenerPosiblesSiguientesEstados(solicitud(EstadoSolicitud.EN_PROCESO, true)));
        assertEquals(List.of(EstadoSolicitud.CERRADA),
                service.obtenerPosiblesSiguientesEstados(solicitud(EstadoSolicitud.RESUELTA, true)));
        assertEquals(List.of(),
                service.obtenerPosiblesSiguientesEstados(solicitud(EstadoSolicitud.CERRADA, true)));
    }

    @Test
    void noPermiteTransicionAlMismoEstado() {
        Solicitud solicitud = solicitud(EstadoSolicitud.CREADA, false);

        assertThrows(BusinessRuleException.class,
                () -> service.validarTransicion(solicitud, EstadoSolicitud.CREADA, EstadoSolicitud.CREADA));
    }

    private static Solicitud solicitud(EstadoSolicitud estado, boolean tuvoEnProceso) {
        Solicitud solicitud = new Solicitud("Titulo", "Descripcion", "Categoria", "Alta", "usuario@test.com");
        solicitud.setEstado(estado);
        solicitud.setTuvoEnProceso(tuvoEnProceso);
        return solicitud;
    }
}
