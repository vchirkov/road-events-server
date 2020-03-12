#!/bin/bash

# This script is executed before copying the source
yum -y update

curl --silent --location https://rpm.nodesource.com/setup_13.x | bash -

yum -y install nodejs

npm install -g pm2
pm2 update

if [ -d "/var/www/road-events-server" ];then
    rm -rf /var/www/road-events-server
    mkdir -p /var/www/road-events-server
else
    mkdir -p /var/www/road-events-server
fi
