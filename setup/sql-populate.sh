echo "Starting to populate Postgres database"
sleep 1
echo "Please supply the password for the Postgres user 'hgeier' when asked."
sleep 1
psql -h localhost -d postgres -U hgeier -W -f ./db.sql
