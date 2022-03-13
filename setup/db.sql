CREATE DATABASE hyttegruppen;
\c hyttegruppen;

CREATE TABLE Seasons (
    season_name varchar(20) PRIMARY KEY,
    first_day timestamp UNIQUE NOT NULL,
    last_day timestamp UNIQUE NOT NULL
);

CREATE TABLE Periods (
    season_name VARCHAR(20),
    starting timestamp NOT NULL,
    ending timestamp NOT NULL,
    
    PRIMARY KEY (starting, ending),
    CONSTRAINT fk_season
        FOREIGN KEY(season_name)
            REFERENCES Seasons(season_name)
            ON DELETE CASCADE
);

CREATE TABLE Cabins (
    cabin_name varchar(20) PRIMARY KEY,
    active boolean
);

CREATE TABLE Users(
    user_id INT PRIMARY KEY,
    user_email varchar(40) UNIQUE NOT NULL,
    user_name varchar(25) NOT NULL, 
    user_password varchar(20), /*deal with hash */
    admin_access boolean
);

CREATE TABLE Applications(
    application_id INT GENERATED ALWAYS AS IDENTITY,
    user_id int,
    employee_id int NOT NULL,
    trip_purpose varchar(20),
    number_of_cabins int,
    winning boolean NULL,
    season varchar(20),

    PRIMARY KEY(application_id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES Users(user_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_season
        FOREIGN KEY(season)
            REFERENCES Seasons(season_name)
            ON DELETE CASCADE
);

CREATE TABLE ApplicationPeriods(
    application_id int,
    starting timestamp NOT NULL,
    ending timestamp NOT NULL,
    CONSTRAINT fk_application
        FOREIGN KEY(application_id)
            REFERENCES Applications(application_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_period
        FOREIGN KEY(starting, ending)
            REFERENCES Periods(starting, ending)
            ON DELETE CASCADE,
    PRIMARY KEY(application_id, starting, ending)
);

CREATE TABLE ApplicationCabins(
    application_id int,
    cabin_name varchar(20) NOT NULL,
    CONSTRAINT fk_application
        FOREIGN KEY(application_id)
            REFERENCES Applications(application_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_cabin
        FOREIGN KEY(cabin_name)
            REFERENCES Cabins(cabin_name)
            ON DELETE CASCADE,
    PRIMARY KEY(application_id, cabin_name)
);

INSERT INTO Seasons (season_name, first_day, last_day)
VALUES('winter2022','2022-01-01', '2022-03-30');
INSERT INTO Periods (starting, ending, season_name) 
VALUES ('2022-02-02', '2022-02-09', 'winter2022'),
('2022-02-09', '2022-02-16', 'winter2022');
INSERT INTO Cabins
VALUES('Utsikten', TRUE);
INSERT INTO Users 
VALUES('981279386', 'test@teter.com','Test', 'password123', FALSE);
INSERT INTO Applications(employee_id, trip_purpose, number_of_cabins, user_id)
VALUES('123', 'private', '1', '981279386');
INSERT INTO ApplicationPeriods (application_id, starting, ending) 
VALUES ('1', '2022-02-02', '2022-02-09');
INSERT INTO ApplicationCabins (application_id, cabin_name) 
VALUES ('1', 'Utsikten');