CREATE DATABASE hyttegruppen;
\c hyttegruppen;
CREATE TABLE Periods (
    starting timestamp,
    ending timestamp
);
INSERT INTO Periods (starting, ending) VALUES ('02-02-2021', '03-03-2021');

CREATE TABLE Cabins (
    noSqlId char(24),
    cabinName varchar(20),
    active boolean,
)