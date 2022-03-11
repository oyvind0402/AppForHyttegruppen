CREATE DATABASE hyttegruppen;
\c hyttegruppen;

CREATE TABLE Seasons (
    season_name varchar(20) NOT NULL,
    first_day timestamp,
    last_day timestamp,
    PRIMARY KEY (season_name)
);

CREATE TABLE Periods (
    starting timestamp NOT NULL,
    ending timestamp NOT NULL,
    PRIMARY KEY (starting, ending),
    CONSTRAINT fk_season
        FOREIGN KEY(season_name)
            REFERENCES Seasons(season_name)
            ON DELETE CASCADE
);

INSERT INTO Seasons (season_name, first_day, last_day)
VALUES('winter2022','01-01-2022', '30-03-2022');
INSERT INTO Periods (starting, ending) 
VALUES ('02-02-2022', '03-03-2022');


CREATE TABLE Cabins (
    cabin_name varchar(20) NOT NULL,
    active boolean,
    PRIMARY KEY (cabin_name)
);

CREATE TABLE Users(
    user_id int GENERATED ALWAYS AS IDENTITY, /* psql syntax? */
    user_name varchar(25) NOT NULL, 
    user_password varchar(20), /*deal with hash */
    admin_access boolean
    PRIMARY KEY(user_id)
);

CREATE TABLE Applications(
    employee_id int NOT NULL,
    trip_purpose varchar(20),
    number_of_cabins int,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES Users(user_id)
            ON DELETE CASCADE
    CONSTRAINT fk_persiod
        FOREIGN KEY(starting, ending)
            REFERENCES Periods(starting, ending)
            ON DELETE CASCADE
    CONSTRAINT fk_cabin
        FOREIGN KEY(cabin_name)
            REFERENCES Cabins(cabin_name)
            ON DELETE CASCADE
);
