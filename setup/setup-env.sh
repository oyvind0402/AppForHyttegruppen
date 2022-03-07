#!/bin/bash

# Install necessary tools for script + PostgreSQL
sudo apt install -y curl dpkg postgresql

# Install MongoDB
mongodeb="$HOME/mongodb.deb"
curl "https://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/5.0/multiverse/binary-amd64/mongodb-org-server_5.0.6_amd64.deb" -o "$mongodeb"
sudo dpkg -i "$mongodeb"
echo "MongoDB has been installed"
sudo mkdir -p /data/db
sudo chmod 777 /data
sudo chmod 777 /data/db
rm "$mongodeb"
# Start MongoDB
nohup mongod &>/dev/null &

# Install MongoDB Shell
mongoshell="$HOME/mongoshell.deb"
curl "https://downloads.mongodb.com/compass/mongodb-mongosh_1.2.2_amd64.deb" -o "$mongoshell"
sudo dpkg -i "$mongoshell"

# Install Go
gosh="go.sh"
if [ -f "$gosh" ]
then
	chmod +x "$gosh"
	bash "$gosh"
else
	echo ""
	echo "ERROR: $gosh not found"
	echo "Go to the folder where this script is located and run $gosh manually"
	echo "REMINDER: you might need to run 'chmod +x $gosh' first"
	sleep 2
fi

# Populate MongoDB
nosql="nosql-populate.sh"
if [ -f "$nosql" ]
then
	chmod +x "$nosql"
	bash "$nosql"
else
	echo ""
	echo "ERROR: $nosql not found"
	echo "Go to the folder where this script is located and run $nosql manually"
	echo "REMINDER: you might need to run 'chmod +x $nosql' first"
	sleep 2
fi