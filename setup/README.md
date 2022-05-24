# Information on scripts

## `setup-env.sh`

The setup available in setup-env.sh is created to automatically install the necessary tools to run the back-end of the project. It is optimised for Debian-based systems running on ARM or AMD processors, but has also been tested on RedHat systems.

For other UNIX systems (including MacOS), most of the setup is usable. You will, however, need to take preventive action before running the setup, and after it exits with an error code of 1 (redirecting you to this README).

If you are running Windows, Solaris or BSD, this setup is incompatible.

Please ensure the script is runnable with
```
chmod +x setup-env.sh
```

### Pre-setup

If you are not on a Debian-based or RedHat system, please ensure you have the following packages installed:

- awk
- curl
- dpkg
- postgresql

If you are running MacOS, the Go (go.sh) setup might not work correctly. Please install Go 1.18 (or above) directly from [Go's official website](https://go.dev/dl/)

### Post-setup
If you are not on a Debian-based or RedHat system, you will need to conclude the installation of MongoDB manually.

You may find MongoDB on your distribution's package manager or directly at [MongoDB's download page](http://repo.mongodb.org/). Please install version 5.0 (or above), as well as MongoSH version 1.4.2 (or above).

After installing MongoDB, you need to guarantee that the database contains a data folder accessible by all users in your system.

#### Adjust permissions

For Linux-based distributions, run:
```
sudo mkdir -p /data/db
sudo chmod 777 /data
sudo chmod 777 /data/db
```

For MacOS, see the UNOFFICIAL [Atta guide](https://attacomsian.com/blog/install-mongodb-macos).

#### Run MongoDB

Once those steps are completed, you will need to start MongoDB. This can be done using, for example, `systemctl`, or the following command:

```
nohup mongod &>/dev/null &
```

#### Creating user

The application will require a user to communicate with MongoDB. Thus, you will need to set up a new user with the necessary permissions.

This may be done within MongoSH or directly from the command line, using

```
echo "use admin
	db.createUser ({
	user: '[yourusername]',
	pwd: '[yourpassword]',
	roles: [ { role: 'readWrite', db: 'hyttegruppen' } ]})" | mongosh
```

When replacing user and password values, erase everything in-between (but not including) the quotation marks. Square brackets (`[]`) should not be included for these two fields.

If running the commands from within MongoSH, you may also replace the password field with `pwd: passwordPrompt()` so that your password will not be shown in plain text.

#### Populating MongoDB

To populate the database, run the script `nosql-populate.sh`. See [instructions in `nosql-populate.sh` section](#nosql-populatesh)

### Known Issues

#### Go path

If Go was successfully installed, but you cannot run any `go` commands, it might not be in your path. Check for '/usr/local/go/bin' in your path with:

```
echo $PATH
```

If it cannot be found in your path, add it with:

```
export PATH="$PATH:/usr/local/go/bin"
```

Retry running any Go commands.

N.B.: The PATH changes will only apply for the current terminal. To apply globally, add the line above to `.bashrc` (or `.zshrc`, or corresponding)

#### Postgres not running

You may be informed that Postgres is not running, or that it is unavailable on port 5432.

Restart the service with

```
systemctl restart postgresql.service
```

If restarting the service is not enough, some external factor may be impacting your connection. See [this StackOverflow discussion](https://stackoverflow.com/questions/31645550/postgresql-why-psql-cant-connect-to-server) to diagnose connection issues.


#### ECONNREFUSED

You will be unable to perform commands against MongoSH if the MongoDB database is not running. The script is set up to ensure the service is started before any `mongosh` commands are run, but the running of the database may fail silently.

Try running MongoDB manually with

```
mongod
```

This will show the logs and might inform you of any issues preventing MongoDB from running.

#### libssl1.1

MongoDB may fail to install correctly, especially on Ubuntu, due to libssl not being installed in the system. Check the [steps described in this StackOverflow post](https://askubuntu.com/questions/1126893/how-to-install-openssl-1-1-1-and-libssl-package).

#### Other Issues

For other issues, consider checking:

- [MongoDB's official tutorial for installing MongoDB on macOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
- [DigitalOcean's tutorial for installing MongoDB on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04)
- [TecAdmin's tutorial for installing MongoDB on Fedora](https://tecadmin.net/install-mongodb-on-fedora/)

## `nosql-populate.sh`

`nosql-populate.sh` is a script which will populate the MongoDB database automatically.

Please ensure the script is runnable with
```
chmod +x nosql-populate.sh
```

You may pass your username and password as parameters, as such:

```
./nosql-populate.sh yourusername yourpassword
```

If no username or password is provided, the script will prompt you to insert them at the appropriate time.

This script may be used at any time to reset the database. ATTENTION: it will erase all data from the application.


## `sql-populate.sh`

`sql-populate.sh` is a script which will populate the PostgreSQL database automatically.

Please ensure the script is runnable with
```
chmod +x sql-populate.sh
```

It will prompt you to insert a username and password when necessary.

This script may be used at any time to reset the database. ATTENTION: it will erase all data from the application.

## `go.sh`

`go.sh` may be used to install or update Go. It is designed for Linux-based systems.

Please ensure the script is runnable with
```
chmod +x go.sh
```

The script will download the latest version available from [Go's website](https://go.dev/dl/) and automatically extract the files.

If a previous installation of Go is found, the script will move it to a backup location and offer the user the alternative to delete or keep it at the end of installation.

This script was NOT developed for the present project. It is a personal project of one of the group members which is [publicly available](https://gist.github.com/anafvana/dd8d1dab55ef362467ceb0f18722987b) and was used throughout the project for convenience.
