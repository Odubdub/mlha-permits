#!/bin/bash

# The script will 
#  - first stop all running containers (if any),
#  - remove containers
#  - remove images
#  - remove volumes

docker compose down

# stop all running containers
echo '####################################################'
echo 'Stopping running containers (if available)...'
echo '####################################################'
docker stop $(docker ps -aq)

# remove all stopped containers
echo '####################################################'
echo 'Removing containers ..'
echo '####################################################'
docker rm $(docker ps -aq)

docker compose up -d --build