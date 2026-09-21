#!/bin/bash
# ==============================================================================
# Script de Aprovisionamiento para Instancia Amazon EC2 (Amazon Linux 2023 / Ubuntu)
# MesaTech Cloud - Plataforma de Microservicios y Base de Datos
# ==============================================================================

set -e

echo "=== 1. Actualizando paquetes del sistema ==="
if [ -x "$(command -v dnf)" ]; then
    sudo dnf update -y
    sudo dnf install -y git docker
elif [ -x "$(command -v apt-get)" ]; then
    sudo apt-get update -y
    sudo apt-get install -y git docker.io docker-compose
fi

echo "=== 2. Habilitando e iniciando Docker ==="
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Instalar Docker Compose v2 si no está disponible
if ! docker compose version &> /dev/null; then
    echo "Instalando Docker Compose CLI Plugin..."
    sudo mkdir -p /usr/local/lib/docker/cli-plugins
    sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-$(uname -m) -o /usr/local/lib/docker/cli-plugins/docker-compose
    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi

echo "=== 3. Clonando repositorio del proyecto MesaTech ==="
APP_DIR="/opt/mesatech"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Copiar archivos de inicialización de base de datos
mkdir -p $APP_DIR/infrastructure/ec2/init-db
cp /c/WORKSPACE/Mesatech/database/*.sql $APP_DIR/infrastructure/ec2/init-db/ 2>/dev/null || true

echo "=== 4. Configurando variables de entorno ==="
cat << 'EOF' > $APP_DIR/infrastructure/ec2/.env
AZURE_TENANT_ID=your-tenant-id-here
AZURE_ISSUER_URI=https://login.microsoftonline.com/your-tenant-id-here/v2.0
AZURE_AUDIENCE=api://api-cloud-native
EOF

echo "=== 5. Despliegue completado con éxito ==="
echo "Para iniciar los servicios: cd $APP_DIR/infrastructure/ec2 && docker compose up -d --build"
