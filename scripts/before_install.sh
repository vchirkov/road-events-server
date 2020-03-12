#!/bin/bash

# This script is executed before copying the source
sudo yum -y update

curl -sL https://rpm.nodesource.com/setup_13.x | sudo bash -

sudo yum -y install nodejs

sudo npm install -g pm2
sudo pm2 update

if [ -d "/var/www/road-events-server" ];then
    rm -rf /var/www/road-events-server
    mkdir -p /var/www/road-events-server
else
    mkdir -p /var/www/road-events-server
fi
