#!/bin/bash

# This script is used to start the application
pm2 start /var/www/road-events-server/src/index.js -n road-events -f
