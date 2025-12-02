DROP TABLE IF EXISTS Assign_To;
DROP TABLE IF EXISTS Confirm;
DROP TABLE IF EXISTS Vehicle;
DROP TABLE IF EXISTS Incident;
DROP TABLE IF EXISTS Station;
DROP TABLE IF EXISTS User;


CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'dispatcher', 'responder', 'reporter') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);


CREATE TABLE Station (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('fire', 'medical', 'police') NOT NULL,
    latitude INT,
    longitude INT
);


CREATE TABLE Vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('ambulance', 'firetruck', 'patrol_car') NOT NULL,
    status ENUM('available', 'busy', 'maintenance') DEFAULT 'available',
    capacity INT,
    user_id INT,
    station_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE SET NULL,
    FOREIGN KEY (station_id) REFERENCES Station(id) ON DELETE SET NULL
);



CREATE TABLE Incident (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT,
    severity INT,
    type ENUM('fire', 'medical', 'crime') NOT NULL,
    location VARCHAR(255),
    latitude INT,
    longitude INT,
    status ENUM('reported', 'dispatched', 'resolved') DEFAULT 'reported',
    capacity INT,
    report_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES User(id) ON DELETE SET NULL
);


CREATE TABLE Confirm (
    incident_id INT NOT NULL,
    user_id INT NOT NULL,
    arrival_time TIMESTAMP NULL,
    solution_time TIMESTAMP NULL,
    PRIMARY KEY (incident_id, user_id),
    FOREIGN KEY (incident_id) REFERENCES Incident(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);


CREATE TABLE Assign_To (
    incident_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    assign_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (incident_id, vehicle_id),
    FOREIGN KEY (incident_id) REFERENCES Incident(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id) ON DELETE CASCADE
);