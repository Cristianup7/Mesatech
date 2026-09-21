package com.mesatech.catalogo.config;

import com.mesatech.catalogo.model.Categoria;
import com.mesatech.catalogo.model.Prioridad;
import com.mesatech.catalogo.repository.CategoriaRepository;
import com.mesatech.catalogo.repository.PrioridadRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final PrioridadRepository prioridadRepository;

    public DataInitializer(CategoriaRepository categoriaRepository, PrioridadRepository prioridadRepository) {
        this.categoriaRepository = categoriaRepository;
        this.prioridadRepository = prioridadRepository;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            categoriaRepository.save(new Categoria("HW", "Hardware y Equipamiento", "Fallas en laptops, monitores, periféricos y partes físicas", true));
            categoriaRepository.save(new Categoria("SW", "Software y Aplicaciones", "Problemas con sistemas operativos, suites ofimáticas y software corporativo", true));
            categoriaRepository.save(new Categoria("NET", "Redes y Conectividad", "Dificultades de acceso VPN, Wi-Fi institucional y navegación interna", true));
            categoriaRepository.save(new Categoria("ACC", "Accesos y Credenciales", "Gestión de cuentas de dominio, restablecimiento de contraseñas y permisos", true));
            categoriaRepository.save(new Categoria("SEG", "Seguridad de la Información", "Reporte de incidentes de seguridad, correos sospechosos y antivirus", true));
        }

        if (prioridadRepository.count() == 0) {
            prioridadRepository.save(new Prioridad("BAJA", "Baja", 1, 48, "#28a745", true));
            prioridadRepository.save(new Prioridad("MEDIA", "Media", 2, 24, "#ffc107", true));
            prioridadRepository.save(new Prioridad("ALTA", "Alta", 3, 8, "#fd7e14", true));
            prioridadRepository.save(new Prioridad("CRITICA", "Crítica", 4, 2, "#dc3545", true));
        }
    }
}
