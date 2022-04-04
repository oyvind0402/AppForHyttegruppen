url=https://go.dev

#get source code of download page
echo "Starting Go installation"

curl -o $HOME/temp.txt $url/dl/

#retrieve the first link for linux amd64 (recommended download)
grepmatch=$( cat $HOME/temp.txt | grep -E '\/dl\/.*linux.*amd64.tar.gz' | head -1)
echo $( echo $grepmatch | sed 's/^.*\(\/dl\/.*tar\.gz\).*$/\1/') > $HOME/temp.txt

#compose link for specific download
url=$url$(cat $HOME/temp.txt)

#curl to get real url to download file
curl -o $HOME/temp.txt $url

# handle backup deletion (and prompt)
deletebackup(){
	read -p "Would you like to delete the Go backup? [y]es [N]o: " answer
	answer=$(echo "$answer" | awk '{print tolower($0)}')
	if [[ $answer == "y" || $answer == "yes" ]]
	then
		sudo rm -rf /usr/local/go_old
		echo "Backup deleted"
	else
		echo "Backup kept in /usr/local/go_old"
	fi
}

# add to PATH if not present already
addToPath(){
	goDir='/usr/local/go/bin'
	if [[ $PATH != *"$goDir"* ]]
	then
		echo "export PATH=\$PATH:$goDir" >> $HOME/.bashrc
		echo "Added $goDir to your path via .bashrc export"
	fi
}

#check if download url found
if [[ $(cat "$HOME/temp.txt") == *"Found"* ]]
then
	if [ -d /usr/local/go ]
	then
		echo "Previous installation of Go found. Backing it up to /usr/local/go_old"
		sudo mv /usr/local/go /usr/local/go_old
		sleep 1
	fi

	url=$(sed 's/^.*\(https.*tar\.gz\).*$/\1/' $HOME/temp.txt)

	#download actual file
	{
		curl -o $HOME/go.tar.gz $url && \
		sudo tar -C /usr/local -xvf $HOME/go.tar.gz && \
		addToPath && \
		source $HOME/.bashrc && \
		deletebackup
	} || {
		echo "Could not finish installation."

		#if backup, restore
		if [ -d /usr/local/go_old ]
		then
			echo "Restoring backup"
			sudo mv /usr/local/go_old /usr/local/go
			echo "Done"
		fi
	}
else
	echo "Could not locate downloadable Go file. Try visiting https://go.dev/dl/ manually"
fi

#remove temporary files
rm $HOME/temp.txt
rm $HOME/go.tar.gz

echo "$0 done"
