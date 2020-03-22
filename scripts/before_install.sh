#!/bin/bash

# This script is executed before copying the source
sudo pm2 update

if [ -d "/var/www/road-events-server" ];then
    sudo rm -rf /var/www/road-events-server
    sudo mkdir -p /var/www/road-events-server
else
    sudo mkdir -p /var/www/road-events-server
fi
