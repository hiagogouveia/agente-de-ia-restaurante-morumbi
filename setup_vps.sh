#!/bin/bash
set -e

echo "--- 1. Updating System and Installing Dependencies ---"
grep -l "docker" /etc/apt/sources.list.d/* 2>/dev/null | xargs rm -f
apt-get update
apt-get install -y ca-certificates curl gnupg git ufw

echo "--- 2. Installing Docker ---"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --batch --yes --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
rm -f /etc/apt/sources.list.d/*docker*.list
echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "--- 3. Setting up Project ---"
cd /root
if [ -d "agente-de-ia-restaurante-morumbi" ]; then
    echo "Updating existing repo..."
    cd agente-de-ia-restaurante-morumbi
    git pull origin main
else
    echo "Cloning repo..."
    git clone https://github.com/hiagogouveia/agente-de-ia-restaurante-morumbi.git
    cd agente-de-ia-restaurante-morumbi
fi

echo "--- 4. Starting Containers ---"
# Ensure .env exists (it was SCP'd to /root/)
if [ -f "/root/.env" ]; then
    cp /root/.env .env
fi

docker compose down || true
docker compose up -d

echo "--- 5. Checking Status ---"
docker ps
