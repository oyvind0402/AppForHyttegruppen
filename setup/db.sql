DROP DATABASE hyttegruppen;
CREATE DATABASE hyttegruppen;
\c hyttegruppen;

CREATE TABLE Seasons (
    season_name varchar(20) PRIMARY KEY,
    first_day timestamp UNIQUE NOT NULL,
    last_day timestamp UNIQUE NOT NULL
);

CREATE TABLE Periods (
    period_id INT GENERATED ALWAYS AS IDENTITY,
    period_name VARCHAR(20),
    season_name VARCHAR(20),
    starting timestamp NOT NULL,
    ending timestamp NOT NULL,
    
    PRIMARY KEY (period_id),
    CONSTRAINT fk_season
        FOREIGN KEY(season_name)
            REFERENCES Seasons(season_name)
            ON DELETE CASCADE
);

CREATE TABLE Cabins (
    cabin_name varchar(20) PRIMARY KEY,
    active boolean NOT NULL
);

CREATE TABLE Users(
    user_id INT PRIMARY KEY NOT NULL,
    email varchar(40) UNIQUE NOT NULL,
    passwd varchar(20) NOT NULL, /*deal with hash */
    firstname varchar(25) NOT NULL, 
    lastname varchar(25) NOT NULL, 
    admin_access boolean NOT NULL
);

CREATE TABLE Applications(
    application_id INT GENERATED ALWAYS AS IDENTITY,
    user_id int NOT NULL,
    employee_id int NOT NULL,
    trip_purpose varchar(20) NOT NULL,
    number_of_cabins int NOT NULL,
    period_id int NOT NULL,
    winner boolean NOT NULL,

    PRIMARY KEY(application_id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES Users(user_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_period
        FOREIGN KEY(period_id)
            REFERENCES Periods(period_id)
            ON DELETE CASCADE
);

CREATE TABLE ApplicationCabins(
    application_id int NOT NULL,
    cabin_name varchar(20) NOT NULL,
    cabin_won boolean NOT NULL,

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
VALUES('winter2022','2022-01-01', '2022-03-30'),
('spring2022','2022-07-01', '2022-11-30');

INSERT INTO Periods (period_name, starting, ending, season_name) 
VALUES ('Week 1', '2022-02-02', '2022-02-09', 'winter2022'),
('Week 2', '2022-02-09', '2022-02-16', 'winter2022'),
('Week 7', '2022-03-21', '2022-03-30', 'winter2022'),
('Week 40', '2022-10-09', '2022-10-16', 'spring2022');

INSERT INTO Cabins
VALUES('Utsikten', TRUE),
('Fanitullen', TRUE);

INSERT INTO Users 
VALUES('981279386', 'test@teter.com','password123', 'test', 'tester', FALSE);

INSERT INTO Applications(user_id, employee_id, trip_purpose, number_of_cabins, period_id, winner)
VALUES('981279386','123', 'private', '1',  '1', FALSE);

INSERT INTO ApplicationCabins (application_id, cabin_name, cabin_won) 
VALUES ('1', 'Utsikten', FALSE),
('1', 'Fanitullen', FALSE);