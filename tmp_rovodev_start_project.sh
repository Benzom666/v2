#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Starting LeSociety Project${NC}"
echo -e "${GREEN}=====================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Node version: $(node -v)${NC}"
echo -e "${YELLOW}NPM version: $(npm -v)${NC}"

# Navigate to API directory
echo -e "\n${GREEN}Step 1: Setting up Backend API...${NC}"
cd lesociety/latest/home/node/secret-time-next-api

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing API dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}API dependencies already installed${NC}"
fi

# Start API in background
echo -e "${GREEN}Starting API on port 5000...${NC}"
npm start &
API_PID=$!
echo -e "${GREEN}API started with PID: $API_PID${NC}"

# Wait a bit for API to start
sleep 5

# Navigate to Frontend directory
echo -e "\n${GREEN}Step 2: Setting up Frontend...${NC}"
cd ../secret-time-next

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Frontend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}Frontend dependencies already installed${NC}"
fi

# Start Frontend in background
echo -e "${GREEN}Starting Frontend on port 3000...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"

# Wait for services to be ready
sleep 10

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}Services Status:${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✓ Backend API: http://localhost:5000 (PID: $API_PID)${NC}"
echo -e "${GREEN}✓ Frontend: http://localhost:3000 (PID: $FRONTEND_PID)${NC}"
echo -e "\n${YELLOW}To stop services, run:${NC}"
echo -e "${YELLOW}kill $API_PID $FRONTEND_PID${NC}"

echo -e "\n${GREEN}Processes are running in background. Check logs below:${NC}"
echo -e "${GREEN}=====================================${NC}\n"

# Keep script running to show logs
wait
