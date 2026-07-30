#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Entrynor Contact Form API Deployment${NC}"
echo "======================================"

# Get the Azure client secret from the user
read -sp "Enter Azure AD Client Secret (will not be echoed): " CLIENT_SECRET
echo ""

if [ -z "$CLIENT_SECRET" ]; then
    echo -e "${RED}Error: Client secret cannot be empty${NC}"
    exit 1
fi

# Create .env file on server
echo -e "${YELLOW}Creating .env file on server...${NC}"
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host bash <<EOFENV
cat > /home/atawarp/entrynor-contact-api/.env << 'ENVEOF'
EMAIL_GRAPH_TENANT_ID=b3a4640e-1e58-4947-a114-09fdc17ec7ea
EMAIL_GRAPH_CLIENT_ID=831d1ba6-4929-4d89-9fb9-01ea3033e13e
EMAIL_GRAPH_CLIENT_SECRET=$CLIENT_SECRET
RECAPTCHA_SECRET_KEY=6Ler10QnAAAAANGBh8fCRSZRWNsQh9aI5
EMAIL_GRAPH_SENDER=info@entrynor.no
FLASK_ENV=production
ENVEOF
chmod 600 /home/atawarp/entrynor-contact-api/.env
echo "Created .env file with secure permissions (600)"
EOFENV

echo -e "${GREEN}✓ .env file created${NC}"

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host bash <<'EOFPIP'
cd /home/atawarp/entrynor-contact-api
python3 -m pip install --upgrade pip -q
python3 -m pip install -r requirements.txt -q
echo "Dependencies installed successfully"
EOFPIP

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Test the API locally
echo -e "${YELLOW}Testing API locally...${NC}"
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host bash <<'EOFTEST'
cd /home/atawarp/entrynor-contact-api
timeout 5 python3 -c "from contact_form_api import app; print('✓ API module loads successfully')" || true
EOFTEST

echo -e "${GREEN}✓ API module validated${NC}"

# Create systemd service
echo -e "${YELLOW}Creating systemd service...${NC}"
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host bash <<'EOFSERVICE'
sudo tee /etc/systemd/system/entrynor-contact-api.service > /dev/null <<'SVCEOF'
[Unit]
Description=Entrynor Contact Form API
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=atawarp
WorkingDirectory=/home/atawarp/entrynor-contact-api
EnvironmentFile=/home/atawarp/entrynor-contact-api/.env
ExecStart=/usr/bin/python3 -m gunicorn --bind 127.0.0.1:5000 --workers 4 --timeout 30 contact_form_api:app
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SVCEOF

sudo systemctl daemon-reload
echo "✓ Service file created and daemon reloaded"
EOFSERVICE

echo -e "${GREEN}✓ Systemd service created${NC}"

# Start the service
echo -e "${YELLOW}Starting service...${NC}"
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo systemctl enable entrynor-contact-api && sudo systemctl start entrynor-contact-api && echo '✓ Service started and enabled'"

echo -e "${GREEN}✓ Service started${NC}"

# Wait and check status
sleep 2
echo -e "${YELLOW}Service status:${NC}"
ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host "sudo systemctl status entrynor-contact-api --no-pager" | head -10

echo ""
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update your website's contact form URL to: https://ata-domain.tempurl.host/api/contact-form"
echo "   OR set up a reverse proxy (nginx/Apache) to forward requests to http://127.0.0.1:5000"
echo "2. Test the contact form on: https://minor-mercury.vercel.app/en/"
echo ""
echo "Monitor logs with:"
echo "  ssh -i ~/.ssh/id_ed25519 atawarp@ata-domain.tempurl.host 'sudo journalctl -u entrynor-contact-api -f'"
