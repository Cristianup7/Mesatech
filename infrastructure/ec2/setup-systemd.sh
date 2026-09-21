#!/bin/bash
set -x

# 1. Servicio Solicitudes (8081)
sudo tee /etc/systemd/system/mesatech-solicitudes.service > /dev/null << 'EOF'
[Unit]
Description=MesaTech Microservicio Solicitudes
After=network.target docker.service

[Service]
Type=simple
User=ec2-user
ExecStart=/usr/bin/java -Xms64m -Xmx192m -Dspring.profiles.active=prod -Dserver.port=8081 -Dspring.datasource.url=jdbc:mysql://localhost:3306/mesatech_solicitudes_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true -Dspring.datasource.username=root -Dspring.datasource.password=RootSecurePassword2026! -jar /home/ec2-user/mesatech/jars/mesatech-solicitudes-1.0.0.jar
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 2. Servicio Catálogo (8082)
sudo tee /etc/systemd/system/mesatech-catalogo.service > /dev/null << 'EOF'
[Unit]
Description=MesaTech Microservicio Catalogo
After=network.target docker.service

[Service]
Type=simple
User=ec2-user
ExecStart=/usr/bin/java -Xms64m -Xmx192m -Dspring.profiles.active=prod -Dserver.port=8082 -Dspring.datasource.url=jdbc:mysql://localhost:3306/mesatech_catalogo_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true -Dspring.datasource.username=root -Dspring.datasource.password=RootSecurePassword2026! -jar /home/ec2-user/mesatech/jars/mesatech-catalogo-1.0.0.jar
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 3. Servicio BFF (8080)
sudo tee /etc/systemd/system/mesatech-bff.service > /dev/null << 'EOF'
[Unit]
Description=MesaTech Backend For Frontend
After=network.target mesatech-solicitudes.service mesatech-catalogo.service

[Service]
Type=simple
User=ec2-user
ExecStart=/usr/bin/java -Xms64m -Xmx192m -Dspring.profiles.active=prod -Dserver.port=8080 -Dservices.solicitudes.url=http://localhost:8081 -Dservices.catalogo.url=http://localhost:8082 -jar /home/ec2-user/mesatech/jars/mesatech-bff-1.0.0.jar
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Recargar y arrancar
sudo systemctl daemon-reload
sudo systemctl enable --now mesatech-solicitudes
sudo systemctl enable --now mesatech-catalogo
sudo systemctl enable --now mesatech-bff

sleep 6
sudo systemctl status mesatech-solicitudes --no-pager
sudo systemctl status mesatech-catalogo --no-pager
sudo systemctl status mesatech-bff --no-pager
