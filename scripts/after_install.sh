#!/bin/bash

# This script is executed after the source is copied to the instances
cd /var/www/road-events-server
npm install
sudo /scripts/import_params.sh -p /ENV -r eu-central-1
