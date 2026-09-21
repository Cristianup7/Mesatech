# Justificación Técnica y Económica: Amazon RDS vs MySQL en Instancia EC2

En el marco del proyecto **MesaTech Cloud**, se evaluaron dos alternativas para la persistencia relacional en Amazon Web Services:
1. **Opción A:** Servicio gestionado **Amazon Relational Database Service (Amazon RDS)** con motor MySQL.
2. **Opción B:** Motor **MySQL Community Edition** instalado directamente en una instancia de computación **Amazon EC2**.

A continuación, se detalla el análisis comparativo bajo criterios arquitectónicos, operativos y económicos:

---

## 1. Cuadro Comparativo de Criterios

| Criterio de Evaluación | Opción A: Amazon RDS (MySQL) | Opción B: MySQL en Amazon EC2 |
| :--- | :--- | :--- |
| **Modelo Operativo** | DBaaS (Database as a Service) 100% Gestionado por AWS | IaaS (Infraestructura como Servicio) con Administración Total |
| **Parches y Mantenimiento** | Automatizados por AWS (parches de OS y motor durante ventanas de mantenimiento) | Manual: El administrador debe actualizar el SO Linux, parches de seguridad y MySQL |
| **Alta Disponibilidad (HA)** | **Multi-AZ sincrónico** nativo con failover automático en segundos | Requiere configurar réplicas primario/secundario manuales, scripts y balanceadores |
| **Copias de Seguridad (Backups)** | Snapshots y backups automatizados continuos con **Point-in-Time Recovery (PITR)** | Requiere configurar cron jobs, scripts `mysqldump`, rotación y subida manual a S3 |
| **Escalabilidad** | Escalado vertical de cómputo y Storage Autoscaling con solo modificar parámetros | Requiere modificar volúmenes EBS, redimensionar particiones de disco y reiniciar |
| **Control y Acceso Root** | Acceso al motor SQL pero **sin acceso root al sistema operativo subyacente** | Acceso total como `root` al sistema operativo y archivos de configuración `my.cnf` |
| **Costo en Capa Gratuita (Free Tier)** | 750 horas/mes de instancia `db.t3.micro` o `db.t4g.micro` + 20 GB de almacenamiento SSD | 750 horas/mes de instancia `t2.micro` o `t3.micro` (compartido si se usa una sola máquina) |
| **Costo Comercial Estimado** | ~\$15 a \$25 USD/mes (t4g.micro en producción básica) | ~\$8 a \$10 USD/mes si se aloja junto a los microservicios en la misma EC2 |

---

## 2. Análisis Detallado de Factores Críticos

### A. Resiliencia y Recuperación ante Desastres (RTO / RPO)
- **Amazon RDS:** Proporciona un RPO (Recovery Point Objective) cercano a cero mediante la replicación continua de logs de transacciones a Amazon S3, permitiendo restaurar la base de datos a cualquier segundo dentro de la ventana de retención (Point-in-Time Recovery).
- **MySQL en EC2:** El RPO depende de la frecuencia del script de respaldo. Si ocurre una caída antes del siguiente snapshot, se pierden las transacciones intermedias.

### B. Esfuerzo de Ingeniería y Deuda Técnica
- Alojar la base de datos dentro de la misma instancia EC2 que los microservicios genera contención de recursos (CPU, memoria RAM y lectura/escritura en disco I/O), pudiendo provocar caídas en cascada si un microservicio consume el 100% de la memoria y el kernel ejecuta el *OOM Killer* sobre el proceso `mysqld`.
- RDS aísla la capa de persistencia en una VPC dedicada, desacoplando el ciclo de vida del cómputo del ciclo de vida del almacenamiento.

### C. Cumplimiento y Seguridad
- RDS integra cifrado en reposo mediante **AWS KMS**, aislamiento de red en subnets privadas sin IP pública accesible por defecto, y rotación de credenciales con **AWS Secrets Manager**.

---

## 3. Conclusión y Decisión para MesaTech Cloud

### Decisión Recomendada para Producción: **Amazon RDS (MySQL)**
Para un entorno empresarial y corporativo de mesa de ayuda como MesaTech Cloud, la elección estratégica es **Amazon RDS**. Permite al equipo de desarrollo enfocarse 100% en la lógica de negocio y SLA de solicitudes, delegando a AWS la alta disponibilidad, parches de seguridad y recuperación ante desastres sin sobrecarga operativa.

### Alternativa de Despliegue en Laboratorio / Evaluación Docente:
Para efectos de la demostración académica y optimización estricta de costos en la cuenta estudiantil de AWS:
- Se preparan los scripts `docker-compose.yml` que permiten ejecutar MySQL como contenedor aislado con volúmenes persistentes en la misma instancia EC2 donde corre el BFF y los microservicios, o bien conectarse fluidamente al endpoint de Amazon RDS cambiando únicamente las variables de entorno `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD`.
