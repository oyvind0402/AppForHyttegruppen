#!/bin/bash

echo "Starting MongoDB database population"

user=$1
pwd=$2

while [[ $user == "" ]]
do
    echo "No MongoDB user found"
    read -r -p "Insert MongoDB username: " u
    user=$u
done

while [[ $pwd == "" ]]
do
    echo "No MongoDB password found"
    read -r -p "Insert password for $user: " p
    pwd=$p
done

mongosh -u $user -p "'$pwd'" --authenticationDatabase "admin" < nosql-queries.js
