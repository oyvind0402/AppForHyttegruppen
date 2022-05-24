#!/bin/bash

echo "This is an interactive setup"
sleep 1
echo "Please pay close attention"
sleep 1
echo ""

# Check UNIX distro
declare PKGMGR
options=($(ls /etc/ | grep -E '(release|version)$'))
for opt in ${options[@]}
do
	case $opt in
		debian_version)
			PKGMGR="apt"
			sudo apt install -y curl dpkg postgresql
			break
			;;
		redhat-release)
			PKGMGR="dnf"
			sudo dnf install -y curl dpkg postgresql
			break
			;;
		*)
			PKGMGR="FAILED"
			;;
	esac
done

if [[ $PKGMGR == "FAILED" ]]
then
	echo "You seem to not be running a Debian or Redhat distribution"
	sleep 1
	echo ""
	echo "Before proceeding, please ensure the following packages are installed on your system:"
	sleep 1
	echo "awk"
	sleep 1
	echo "curl"
	sleep 1
	echo "dpkg"
	sleep 1
	echo "postgresql"
	sleep 1
	read -r -p "If you have these packages, press ENTER to continue. Otherwise, press CTRL + C to EXIT." res
fi

# Install necessary tools for script + PostgreSQL
sudo apt install -y curl dpkg postgresql

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

# Set up PostgreSQL user
echo "Setting up PostgreSQL user"
sleep 1

read -r -p "Insert desired username (default is 'hgeier'): " psqlu
psqluser="hgeier"
if [[ $psqlu != "" ]]
then
	psqluser=$psqlu
fi

read -r -p "Insert desired password: " psqlp
psqlpwd=$psqlp
while [[ $psqlpwd == "" ]]
do
    echo "No password provided"
    read -r -p "Insert new password for $psqluser: " psqlp
    psqlpwd=$psqlp
done

sudo -u postgres psql postgres -c "CREATE USER $psqluser password '$psqlpwd';" -c "GRANT ALL ON ALL TABLES IN SCHEMA postgres TO $psqluser;" -c "ALTER ROLE $psqluser WITH SUPERUSER CREATEDB CREATEROLE LOGIN REPLICATION BYPASSRLS"

sleep 1
echo ""


# Populate PostgreSQL
postgres="sql-populate.sh"
if [ -f "$postgres" ]
then
	chmod +x "$postgres"
	bash "$postgres"
else
	echo ""
	echo "ERROR: $postgres not found"
	echo "Go to the folder where this script is located and run $postgres manually"
	echo "REMINDER: you might need to run 'chmod +x $postgres' first"
	sleep 2
fi

# Install MongoDB
echo ""
echo "Beginning MongoDB installation..."

declare mongofile
declare mongourl

read -r -p "Are you on a M1 Mac? [y]es / [N]o: " arch
arch=$(echo "$arch" | awk '{print tolower($0)}')
if [[ $arch == "y" || $arch == "yes" ]]
then
	case $PKGMGR in
		apt)
			mongofile="$HOME/mongodb.deb"
			mongourl="http://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/5.0/multiverse/binary-arm64/mongodb-org-server_5.0.6_arm64.deb"
			mongoshellurl="http://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/5.0/multiverse/binary-arm64/mongodb-mongosh_1.4.2_arm64.deb"
			;;
		dnf)
			echo '[Mongodb]
			name=MongoDB Repository
			baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/4.4/x86_64/
			gpgcheck=1
			enabled=1
			gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc' | sudo tee /etc/yum.repos.d/mongodb.repo
			sudo dnf install mongodb-org mongodb-org-server
			sudo systemctl enable mongod.service
			sudo systemctl start mongod.service
			;;
		*)
			echo "You are not running a Debian-based or RedHat system. Please visit http://repo.mongodb.org/ and locate the correct package for your system or use your package manager."
			sleep 1
			echo "The setup will be terminated"
			sleep 1
			echo "See README.md for last steps"
			exit 1
			;;
	esac
else
	case $PKGMGR in
		apt)
			mongofile="$HOME/mongodb.deb"
			mongourl="https://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/5.0/multiverse/binary-amd64/mongodb-org-server_5.0.6_amd64.deb"
			mongoshellurl="http://repo.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/5.0/multiverse/binary-amd64/mongodb-mongosh_1.4.2_amd64.deb"
			;;
		dnf)
			echo '[Mongodb]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc' | sudo tee /etc/yum.repos.d/mongodb.repo
			sudo dnf install mongodb-org mongodb-org-server mongosh
			sudo systemctl enable mongod.service
			sudo systemctl start mongod.service
			;;
		*)
			echo "You are not running a Debian-based or RedHat system. Please visit http://repo.mongodb.org/ and locate the correct package for your system or use your package manager."
			sleep 1
			echo "The setup will be terminated"
			sleep 1
			echo "See README.md for last steps"
			exit 1
			;;
	esac

fi

if [[ $PKGMGR == "apt" ]]
then
	curl "$mongourl" -o "$mongofile"
	sudo dpkg -i "$mongofile"
	rm "$mongofile"

	sudo mkdir -p /data/db
	sudo chmod 777 /data
	sudo chmod 777 /data/db

	# Start MongoDB
	nohup mongod &>/dev/null &

	# Install MongoDB Shell
	mongoshell="$HOME/mongoshell.deb"
	curl "$mongoshellurl" -o "$mongoshell"
	sudo dpkg -i "$mongoshell"
fi

sleep 1
echo ""
echo "Starting MongoDB user setup"
sleep 1
read -r -p "Insert desired username (default is 'hgeier'): " mongou
mongouser="hgeier"
if [[ $mongou != "" ]]
then
	mongouser=$mongou
fi

read -r -p "Insert desired password: " mongop
mongopwd=$mongop
while [[ $mongopwd == "" ]]
do
    echo "No password provided"
    read -r -p "Insert new password for $mongouser: " psqlp
    psqlpwd=$mongop
done
echo "use admin
	db.createUser ({
	user: '$mongouser',
	pwd: '$mongopwd',
	roles: [ { role: 'readWrite', db: 'hyttegruppen' } ]})" | mongosh

# Populate MongoDB
nosql="nosql-populate.sh"
if [ -f "$nosql" ]
then
	chmod +x "$nosql"
	bash "$nosql" "$mongouser" "$mongopwd"
else
	echo ""
	echo "ERROR: $nosql not found"
	echo "Go to the folder where this script is located and run $nosql manually"
	echo "REMINDER: you might need to run 'chmod +x $nosql' first"
	sleep 2
fi

