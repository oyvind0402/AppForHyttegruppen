DROP DATABASE hyttegruppen;
CREATE DATABASE hyttegruppen ENCODING 'SQL_ASCII' TEMPLATE template0 LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';
\c hyttegruppen;

CREATE TABLE Seasons (
    season_name varchar(20) PRIMARY KEY,
    first_day timestamp UNIQUE NOT NULL,
    last_day timestamp UNIQUE NOT NULL,
    apply_from timestamp NOT NULL,
    apply_until timestamp NOT NULL
);

CREATE TABLE Periods (
    period_id SERIAL PRIMARY KEY,
    period_name VARCHAR(20),
    season_name VARCHAR(20),
    starting timestamp NOT NULL,
    ending timestamp NOT NULL,
    
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
    user_id char(22) PRIMARY KEY NOT NULL,
    email varchar(40) UNIQUE NOT NULL,
    passwd varchar(20) NOT NULL, /*deal with hash */
    firstname varchar(25) NOT NULL, 
    lastname varchar(25) NOT NULL, 
    admin_access boolean NOT NULL
);

CREATE TABLE Applications(
    application_id SERIAL PRIMARY KEY,
    user_id char(22) NOT NULL,
    employee_id varchar(40) NOT NULL,
    trip_purpose varchar(20) NOT NULL,
    number_of_cabins int NOT NULL,
    cabin_assignment varchar(10) NOT NULL,
    period_id int NOT NULL,
    winner boolean NOT NULL,

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

CREATE TABLE Faq(
    faq_id SMALLSERIAL PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL
);

INSERT INTO Seasons (season_name, first_day, last_day, apply_from, apply_until)
VALUES('winter2022','2022-01-01', '2022-03-30', '2021-10-01', '2021-12-31'),
('spring2022','2022-07-01', '2022-11-30', '2022-02-01', '2022-05-30');

INSERT INTO Periods (period_name, starting, ending, season_name) 
VALUES ('Week 1', '2022-01-03', '2022-01-10', 'winter2022'),
('Week 2', '2022-01-10', '2022-01-17', 'winter2022'),
('Week 3', '2022-01-17', '2022-01-24', 'winter2022'),
('Week 4', '2022-01-24', '2022-01-31', 'winter2022'),
('Week 5', '2022-01-31', '2022-02-07', 'winter2022'),
('Week 6', '2022-02-07', '2022-02-14', 'winter2022'),
('Week 7', '2022-02-14', '2022-02-21', 'winter2022'),
('Week 8', '2022-02-21', '2022-02-28', 'winter2022'),
('Week 9', '2022-02-28', '2022-03-07', 'winter2022'),
('Week 10', '2022-03-07', '2022-03-14', 'winter2022'),
('Week 11', '2022-03-14', '2022-03-21', 'winter2022'),
('Week 12', '2022-03-21', '2022-03-28', 'winter2022'),
('Week 13', '2022-03-28', '2022-04-04', 'winter2022'),
('Week 14', '2022-04-04', '2022-04-11', 'winter2022'),
('Week 15', '2022-04-11', '2022-04-18', 'winter2022'),
('Week 16', '2022-04-18', '2022-04-25', 'winter2022'),
('Week 17', '2022-04-25', '2022-05-02', 'winter2022'),
('Week 40', '2022-10-09', '2022-10-16', 'spring2022');


INSERT INTO Cabins
VALUES('Utsikten', TRUE),
('Store Grøndalen', TRUE),
('Knausen', TRUE),
('Fanitullen', TRUE);

INSERT INTO Users 
VALUES('Z5CBgnCHiFsYXMmNdBYmKA', 'test@teter.com','password123', 'test', 'tester', FALSE),
('Z5CBgnCHiFsYXMmNdBYmKB', 'admin@adminr.com','admin', 'Admin', 'Adminer', TRUE);

INSERT INTO Applications(user_id, employee_id, trip_purpose, number_of_cabins, cabin_assignment, period_id, winner)
VALUES('Z5CBgnCHiFsYXMmNdBYmKA','my.id', 'private', '1', 'random', '1', FALSE);

INSERT INTO ApplicationCabins (application_id, cabin_name, cabin_won) 
VALUES ('1', 'Utsikten', FALSE),
('1', 'Fanitullen', FALSE);

INSERT INTO Faq (question, answer) 
VALUES ('Question 1?', 'Hello i am an answer'),
('Hvor mye koster en hytte?', 'En hytte koster 1200 NOK per uke men pga corona blir det 1200 NOK i tilleg for at hytta skal vaskes.'),
('Question 2', 'Enda et svar');
