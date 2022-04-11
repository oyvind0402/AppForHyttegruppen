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
VALUES('winter2022','2022-01-01', '2022-01-01', '2022-03-31', '2021-12-31'),
('autum2022','2022-08-29', '2022-03-30', '2023-01-02', '2021-08-14');

INSERT INTO Periods (period_name, starting, ending, season_name) 
VALUES ('Uke 1', '2022-01-03', '2022-01-11', 'winter2022'),
('Uke 35', '2022-08-29', '2022-09-05', 'autum2022'),
('Uke 36', '2022-09-05', '2022-09-12', 'autum2022'),
('Uke 37', '2022-09-12', '2022-09-19', 'autum2022'),
('Uke 38', '2022-09-19', '2022-09-26', 'autum2022'),
('Uke 39', '2022-09-26', '2022-10-03', 'autum2022'),
('Uke 40', '2022-10-03', '2022-10-10', 'autum2022'),
('Uke 41', '2022-10-10', '2022-10-17', 'autum2022'),
('Uke 42', '2022-10-17', '2022-10-24', 'autum2022'),
('Uke 43', '2022-10-24', '2022-10-31', 'autum2022'),
('Uke 44', '2022-10-31', '2022-11-07', 'autum2022'),
('Uke 45', '2022-11-07', '2022-11-14', 'autum2022'),
('Uke 46', '2022-11-14', '2022-11-21', 'autum2022'),
('Uke 47', '2022-11-21', '2022-11-28', 'autum2022'),
('Uke 48', '2022-11-28', '2022-12-05', 'autum2022'),
('Uke 49', '2022-12-05', '2022-12-12', 'autum2022'),
('Uke 50', '2022-12-12', '2022-12-19', 'autum2022'),
('Uke 51', '2022-12-19', '2022-12-26', 'autum2022'),
('Uke 52', '2022-12-26', '2023-01-02', 'autum2022');


INSERT INTO Cabins
VALUES('Utsikten', TRUE),
('Fanitullen', TRUE),
('Knausen', TRUE),
('Store Grøndalen', TRUE);

INSERT INTO Users 
VALUES('Z5CBgnCHiFsYXMmNdBYmKA', 'test@teter.com','password123', 'test', 'tester', FALSE),
('Z5CBgnCHiFsYXMmNdBYmKB', 'admin@adminr.com','admin', 'Admin', 'Adminer', TRUE);

INSERT INTO Applications(user_id, employee_id, trip_purpose, number_of_cabins, cabin_assignment, period_id, winner)
VALUES('Z5CBgnCHiFsYXMmNdBYmKA','mark.v.d.baan', 'private', '1', 'random', '1', TRUE), /*Won in the past*/
('Z5CBgnCHiFsYXMmNdBYmKA','mark.v.d.baan', 'private', '1', 'random', '2', TRUE),
('Z5CBgnCHiFsYXMmNdBYmKA','mark.v.d.baan', 'private', '1', 'random', '3', FALSE);

INSERT INTO ApplicationCabins (application_id, cabin_name, cabin_won) 
VALUES ('1', 'Utsikten', TRUE),
('1', 'Fanitullen', FALSE),
('2', 'Utsikten', FALSE),
('2', 'Fanitullen', FALSE),
('2', 'Knausen', TRUE),
('2', 'Store Grøndalen', FALSE),
('3', 'Utsikten', FALSE),
('3', 'Fanitullen', FALSE),
('3', 'Knausen', FALSE),
('3', 'Store Grøndalen', FALSE);

INSERT INTO Faq (question, answer) 
VALUES ('Hvordan avbestiller jeg en tur?', 'En tur kan avbestilles under mine turer eller ved å ta kontakt med hyttekomiten@accentur.com. Dersom man avbestiller senere en to uker før avreise blir det en ekstra kostnad på 500 NOK'),
('Hvor mye koster en hytte?', 'En hytte koster 1200 NOK per uke men pga corona blir det 1200 NOK i tilleg for at hytta skal vaskes.'),
('Hvordan betaler jeg for en hyttetur?', '1200 NOK blir trukket fra din lønnsslipp og 1200 NOK må vippses til vaksebyrået.'),
('Noen ble ødelagt, hvordan sier jeg fra?', 'Du kan enten fylle ut et tilbakemeldingskjema under mine turer eller dersom det er litt mer krise kan du ta kontakt med: 123 456 78'),
('Hvem kontakter jeg dersom jeg har er spørsmål?', 'Dersom du har er spørsmål kan du ta kontakt med hyttekomiten@accentur.com');