#!/bin/bash

# This script is executed after the source is copied to the instances
cd /var/www/road-events-server
npm install
sh ./import_params.sh -p /ENV -r eu-central-1
