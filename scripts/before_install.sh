#!/bin/bash

# This script is executed before copying the source

npm install npm@latest -g
npm cache clean -f
sudo npm install n -g
sudo n stable
pm2 update
touch asdf

if [ -d "/var/www/road-events-server" ];then
    rm -rf /var/www/road-events-server
    mkdir -p /var/www/road-events-server
else
    mkdir -p /var/www/road-events-server
fi
