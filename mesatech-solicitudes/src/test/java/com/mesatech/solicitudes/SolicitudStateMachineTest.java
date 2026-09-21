package com.mesatech.solicitudes;

import com.mesatech.solicitudes.dto.CambiarEstadoDTO;
import com.mesatech.solicitudes.dto.SolicitudRequestDTO;
import com.mesatech.solicitudes.dto.SolicitudResponseV1DTO;
import com.mesatech.solicitudes.dto.SolicitudResponseV2DTO;
import com.mesatech.solicitudes.exception.BusinessRuleException;
import com.mesatech.solicitudes.model.EstadoSolicitud;
import com.mesatech.solicitudes.service.SolicitudService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SolicitudStateMachineTest {

    @Autowired
    private SolicitudService solicitudService;

    @Test
    @DisplayName("Flujo exitoso completo: CREADA -> ASIGNADA -> EN_PROCESO -> RESUELTA -> CERRADA")
    void testFlujoCompletoExitoso() {
        // 1. Crear solicitud (inicia en CREADA)
        SolicitudRequestDTO dto = new SolicitudRequestDTO(
                "Falla en ratón inalámbrico",
                "El cursor no responde",
                "Hardware y Equipamiento",
                "Baja",
                "cliente@test.com"
        );
        SolicitudResponseV1DTO creada = solicitudService.crearSolicitud(dto);
        assertNotNull(creada.getId());
        assertEquals(EstadoSolicitud.CREADA, creada.getEstado());

        // 2. CREADA -> ASIGNADA
        SolicitudResponseV1DTO asignada = solicitudService.cambiarEstado(
                creada.getId(),
                new CambiarEstadoDTO(EstadoSolicitud.ASIGNADA, "operador@test.com", "Asignando")
        );
        assertEquals(EstadoSolicitud.ASIGNADA, asignada.getEstado());

        // 3. ASIGNADA -> EN_PROCESO
        SolicitudResponseV1DTO enProceso = solicitudService.cambiarEstado(
                creada.getId(),
                new CambiarEstadoDTO(EstadoSolicitud.EN_PROCESO, "operador@test.com", "En revisión")
        );
        assertEquals(EstadoSolicitud.EN_PROCESO, enProceso.getEstado());

        // 4. EN_PROCESO -> RESUELTA (permitido porque pasó por EN_PROCESO)
        SolicitudResponseV1DTO resuelta = solicitudService.cambiarEstado(
                creada.getId(),
                new CambiarEstadoDTO(EstadoSolicitud.RESUELTA, "operador@test.com", "Batería reemplazada")
        );
        assertEquals(EstadoSolicitud.RESUELTA, resuelta.getEstado());

        // 5. RESUELTA -> CERRADA
        SolicitudResponseV1DTO cerrada = solicitudService.cambiarEstado(
                creada.getId(),
                new CambiarEstadoDTO(EstadoSolicitud.CERRADA, "cliente@test.com", "Confirmado conforme")
        );
        assertEquals(EstadoSolicitud.CERRADA, cerrada.getEstado());
    }

    @Test
    @DisplayName("Regla Crítica: Rechazar paso directo de CREADA a RESUELTA sin pasar por EN_PROCESO")
    void testRechazarPasoDirectoCreadaAResuelta() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO(
                "Problema de pantalla azul",
                "Se reinicia de improviso",
                "Software y Aplicaciones",
                "Alta",
                "cliente@test.com"
        );
        SolicitudResponseV1DTO creada = solicitudService.crearSolicitud(dto);

        // Intento ilegal: CREADA -> RESUELTA
        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> {
            solicitudService.cambiarEstado(
                    creada.getId(),
                    new CambiarEstadoDTO(EstadoSolicitud.RESUELTA, "operador@test.com", "Intento indebido")
            );
        });

        assertTrue(ex.getMessage().contains("EN_PROCESO") || ex.getMessage().contains("CREADA"));
    }

    @Test
    @DisplayName("Regla Crítica: Rechazar paso de ASIGNADA a RESUELTA sin pasar por EN_PROCESO")
    void testRechazarPasoAsignadaAResueltaSinEnProceso() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO(
                "Acceso a carpeta compartida",
                "Error de permisos",
                "Accesos y Credenciales",
                "Media",
                "cliente@test.com"
        );
        SolicitudResponseV1DTO creada = solicitudService.crearSolicitud(dto);

        // CREADA -> ASIGNADA
        solicitudService.cambiarEstado(
                creada.getId(),
                new CambiarEstadoDTO(EstadoSolicitud.ASIGNADA, "operador@test.com", "Asignado")
        );

        // Intento ilegal: ASIGNADA -> RESUELTA
        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> {
            solicitudService.cambiarEstado(
                    creada.getId(),
                    new CambiarEstadoDTO(EstadoSolicitud.RESUELTA, "operador@test.com", "Salto ilegal de estado")
            );
        });

        assertTrue(ex.getMessage().contains("EN_PROCESO") || ex.getMessage().contains("ASIGNADA"));
    }

    @Test
    @DisplayName("Versionamiento: Comprobar coexistencia y datos enriquecidos en API v2")
    void testVersionamientoV2() {
        List<SolicitudResponseV2DTO> v2List = solicitudService.listarTodasV2(null, null, null);
        assertNotNull(v2List);
        assertFalse(v2List.isEmpty());

        SolicitudResponseV2DTO primerTicket = v2List.get(0);
        assertEquals("v2.0-enhanced", primerTicket.getApiVersion());
        assertNotNull(primerTicket.getEstadoSla());
        assertNotNull(primerTicket.getPosiblesSiguientesEstados());
        assertNotNull(primerTicket.getHistorialAuditoria());
    }
}
