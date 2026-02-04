#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Setting up Cloudflare Tunnel${NC}"
echo -e "${BLUE}=====================================${NC}"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}Cloudflared is not installed. Installing...${NC}"
    
    # Detect OS and install accordingly
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${YELLOW}Detected Linux. Installing cloudflared...${NC}"
        wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
        sudo dpkg -i cloudflared-linux-amd64.deb
        rm cloudflared-linux-amd64.deb
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "${YELLOW}Detected macOS. Installing cloudflared via Homebrew...${NC}"
        brew install cloudflared
    else
        echo -e "${RED}Unsupported OS. Please install cloudflared manually from:${NC}"
        echo -e "${RED}https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Cloudflared is already installed${NC}"
fi

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}Creating Cloudflare Tunnels${NC}"
echo -e "${GREEN}=====================================${NC}"

echo -e "\n${YELLOW}Starting tunnel for Frontend (port 3000)...${NC}"
cloudflared tunnel --url http://localhost:3000 > tmp_rovodev_tunnel_frontend.log 2>&1 &
FRONTEND_TUNNEL_PID=$!

# Wait for tunnel to initialize and extract URL
sleep 5

# Extract the tunnel URL from log
FRONTEND_TUNNEL_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' tmp_rovodev_tunnel_frontend.log | head -1)

echo -e "\n${YELLOW}Starting tunnel for Backend API (port 5000)...${NC}"
cloudflared tunnel --url http://localhost:5000 > tmp_rovodev_tunnel_backend.log 2>&1 &
BACKEND_TUNNEL_PID=$!

# Wait for tunnel to initialize and extract URL
sleep 5

# Extract the tunnel URL from log
BACKEND_TUNNEL_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' tmp_rovodev_tunnel_backend.log | head -1)

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}Cloudflare Tunnels Active!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${BLUE}Frontend Tunnel:${NC} ${GREEN}$FRONTEND_TUNNEL_URL${NC}"
echo -e "${BLUE}Backend Tunnel:${NC} ${GREEN}$BACKEND_TUNNEL_URL${NC}"
echo -e "\n${YELLOW}PIDs:${NC}"
echo -e "Frontend Tunnel PID: $FRONTEND_TUNNEL_PID"
echo -e "Backend Tunnel PID: $BACKEND_TUNNEL_PID"

echo -e "\n${YELLOW}To stop tunnels, run:${NC}"
echo -e "${YELLOW}kill $FRONTEND_TUNNEL_PID $BACKEND_TUNNEL_PID${NC}"

echo -e "\n${YELLOW}Note: You may need to update your .env files to use these tunnel URLs${NC}"
echo -e "${YELLOW}if you want the frontend to communicate with the backend via tunnel.${NC}"

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}Scan QR Code with your mobile device:${NC}"
echo -e "${GREEN}=====================================${NC}"

# Generate QR code for easy mobile access (if qrencode is available)
if command -v qrencode &> /dev/null; then
    echo -e "\n${BLUE}Frontend QR Code:${NC}"
    qrencode -t ANSIUTF8 "$FRONTEND_TUNNEL_URL"
else
    echo -e "${YELLOW}Install 'qrencode' for QR code generation: sudo apt install qrencode${NC}"
fi

echo -e "\n${GREEN}Tunnels running... Press Ctrl+C to stop${NC}"

# Keep script running
tail -f tmp_rovodev_tunnel_frontend.log tmp_rovodev_tunnel_backend.log
