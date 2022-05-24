echo "Starting to populate Postgres database"
sleep 1
echo ""
read -r -p "Insert username (or press Enter to continue; default is 'hgeier'): " u
user="hgeier"
if [[ $u != "" ]]
then
	user=$u
fi
echo ""
echo "Please supply the password for the Postgres user $user when asked."
sleep 1
psql -h localhost -d postgres -U "$user" -W -f ./db.sql
