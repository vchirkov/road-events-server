#!/bin/bash

# This script is used to start the application
cd /var/www/road-events-server/
sudo sh scripts/import_params.sh -p /ROAD_EVENTS/ENV -r eu-central-1
sudo pm2 start src/index.js -n road-events -f
