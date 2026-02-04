#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}LeSociety Quick Start${NC}"
echo -e "${BLUE}=====================================${NC}"

# Start the project services
echo -e "${GREEN}Starting project services...${NC}"
bash tmp_rovodev_start_project.sh &
PROJECT_PID=$!

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to start (15 seconds)...${NC}"
sleep 15

# Start Cloudflare tunnels
echo -e "\n${GREEN}Starting Cloudflare tunnels...${NC}"
bash tmp_rovodev_setup_cloudflare_tunnel.sh

wait
