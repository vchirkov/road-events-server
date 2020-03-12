#!/bin/bash

source "/home/ec2-user/.bash_profile"

# This script is executed after the source is copied to the instances
cd /var/www/road-events-server
sudo npm install
