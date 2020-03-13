#!/bin/bash

# This script is used to start the application
sudo sh scripts/import_params.sh -p /ENV -r eu-central-1
sudo pm2 start /var/www/road-events-server/src/index.js -n road-events -f
