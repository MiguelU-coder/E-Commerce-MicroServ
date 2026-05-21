#!/bin/bash
set -e

EC2_IP="${1:-}"
if [ -z "$EC2_IP" ]; then
  echo "Uso: ./deploy.sh <EC2_PUBLIC_IP>"
  echo "Ej:  ./deploy.sh 54.123.45.67"
  exit 1
fi

echo "=== Desplegando E-Commerce MicroServ en EC2: $EC2_IP ==="
echo ""

echo "1. Instalando Docker..."
sudo apt update -qq
sudo apt install docker.io docker-compose-v2 -y -qq
sudo usermod -aG docker $USER 2>/dev/null

echo "2. Configurando swap (2GB)..."
if ! swapon --show | grep -q /swapfile; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo "   Swap de 2GB creado"
else
  echo "   Swap ya existe"
fi

echo "3. Verificando espacio en disco..."
DISK_AVAIL=$(df / | awk 'NR==2 {print $4}')
if [ "$DISK_AVAIL" -lt 2000000 ]; then
  echo "   Espacio bajo ($((DISK_AVAIL/1024))MB). Limpiando Docker..."
  docker system prune -a --volumes -f 2>/dev/null || true
  sudo apt clean
  DISK_AVAIL=$(df / | awk 'NR==2 {print $4}')
  echo "   Espacio libre: $((DISK_AVAIL/1024))MB"
fi

echo "4. Exportando IP pública..."
export EC2_PUBLIC_IP=$EC2_IP
export NODE_OPTIONS="${NODE_OPTIONS:-"--max-old-space-size=512"}"

echo "5. Construyendo imágenes en orden..."
echo "   (con NODE_OPTIONS=$NODE_OPTIONS)"
echo ""

# Infraestructura base
docker compose build postgres
docker compose build kafka-broker-1 kafka-broker-2 kafka-broker-3
docker compose build kafka-ui

# Backend services (usando tsx, sin build pesado)
docker compose build auth-service
docker compose build product-service
docker compose build order-service
docker compose build email-service
docker compose build payment-service

# Frontend (Next.js - requieren mucha memoria)
echo "   Construyendo client (Next.js)..."
docker compose build --build-arg NODE_OPTIONS="$NODE_OPTIONS" client
echo "   Construyendo admin (Next.js)..."
docker compose build --build-arg NODE_OPTIONS="$NODE_OPTIONS" admin

echo ""
echo "6. Levantando servicios..."
docker compose up -d postgres
sleep 5
docker compose up -d kafka-broker-1 kafka-broker-2 kafka-broker-3
sleep 10
docker compose up -d
sleep 3

echo ""
echo "=== Despliegue completado! ==="
echo "Storefront: http://$EC2_IP:3002"
echo "Admin:      http://$EC2_IP:3003"
echo "Kafka UI:   http://$EC2_IP:8080"
echo ""
echo "Comandos útiles:"
echo "  docker compose logs -f    Ver logs"
echo "  docker compose ps         Ver estado"
echo "  docker compose down       Detener todo"
echo "  docker system prune -a    Limpiar espacio si es necesario"
