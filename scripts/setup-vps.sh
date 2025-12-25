#!/bin/bash
# MindRx Ollama VPS Setup Script
# Run on: Ubuntu 24.04 (8GB RAM, 2 CPU)
# Server: 72.60.110.67

set -e

echo "=== MindRx Ollama Server Setup ==="

# Update system
echo "[1/6] Updating system..."
apt update && apt upgrade -y

# Install Ollama
echo "[2/6] Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

# Configure Ollama to listen on all interfaces
echo "[3/6] Configuring Ollama for remote access..."
mkdir -p /etc/systemd/system/ollama.service.d

cat > /etc/systemd/system/ollama.service.d/override.conf << 'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"
EOF

# Reload systemd and restart Ollama
systemctl daemon-reload
systemctl restart ollama
systemctl enable ollama

# Wait for Ollama to start
echo "[4/6] Waiting for Ollama to start..."
sleep 5

# Pull uncensored model (dolphin-mistral is best for 8GB RAM)
echo "[5/6] Pulling dolphin-mistral model (this may take 10-15 minutes)..."
ollama pull dolphin-mistral

# Optional: Pull smaller backup model
echo "[5b/6] Pulling tinydolphin as backup..."
ollama pull tinydolphin

# Configure firewall
echo "[6/6] Configuring firewall..."
ufw allow 11434/tcp
ufw --force enable

# Verify
echo ""
echo "=== Setup Complete ==="
echo ""
echo "Ollama is running on: http://72.60.110.67:11434"
echo ""
echo "Test with:"
echo "  curl http://72.60.110.67:11434/api/tags"
echo ""
echo "Available models:"
ollama list
echo ""
echo "Test generation:"
echo '  curl http://72.60.110.67:11434/api/generate -d '\''{"model": "dolphin-mistral", "prompt": "Hello", "stream": false}'\'''
