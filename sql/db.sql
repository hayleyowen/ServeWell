-- SQL code to create the database

Create database ServeWell;
Use ServeWell;

-- Creating the tables within the db

CREATE TABLE church (
    church_id INT PRIMARY KEY AUTO_INCREMENT,
    churchname VARCHAR(100) NOT NULL,
    churchphone VARCHAR(15) NOT NULL,
    streetaddress VARCHAR(255),
    postalcode VARCHAR(20),
    city VARCHAR(100),
    denomination VARCHAR(100),
    email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ministry (
    ministry_id INT PRIMARY KEY AUTO_INCREMENT,
    ministryname VARCHAR(100) NOT NULL,
    church_id INT NOT NULL,
    budget DECIMAL(10, 2),
    description TEXT,
    url_path TEXT,
    CONSTRAINT ministry_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

CREATE TABLE IF NOT EXISTS roles (
    Role_ID INT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL,
    Description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    auth0ID VARCHAR(75) NOT NULL UNIQUE,
    minID INT DEFAULT NULL,
    rID INT DEFAULT 0,
    churchID INT Default NULL,

    FOREIGN KEY (minID) REFERENCES ministry(ministry_id),
    FOREIGN KEY (rID) REFERENCES roles(Role_ID),
    FOREIGN KEY (churchID) REFERENCES church(church_id)
);

CREATE TABLE IF NOT EXISTS requestingAdmins (
    reqID INT PRIMARY KEY AUTO_INCREMENT,
    auth0ID VARCHAR(75) NOT NULL,
    churchID INT NOT NULL,

    FOREIGN KEY (auth0ID) REFERENCES users(auth0ID),
    FOREIGN KEY (churchID) REFERENCES church(church_id)
);

CREATE TABLE uploaded_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_name TEXT NOT NULL,
    file_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tab_name VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    page_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    church_id INT NOT NULL,
    FOREIGN KEY (church_id) REFERENCES church(church_id)
);

CREATE TABLE calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start DATETIME NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255) NULL
);


-- Inserting data into the tables for testing

INSERT INTO church (churchname, churchphone, streetaddress, postalcode, city, denomination, email) VALUES
('Temple Baptist Church', '318-555-5555', '1234 Main St', '71111', 'Shreveport', 'Baptist', 'hello@temple.life'),
('First United Methodist Church', '318-555-5555', '1234 Main St', '71111', 'Shreveport', 'Methodist', 'hello@first.united'),
('St. Mary''s Catholic Church', '318-555-5555', '1234 Main St', '71111', 'Shreveport', 'Catholic', 'hello@st.marys');

INSERT INTO ministry (ministryname, church_id, budget, description, url_path) VALUES 
('Youth Ministry', 1, 1000.00, 'Ministry for the youth', 'youthministry'),
('Children''s Ministry', 1, 500.00, 'Ministry for the children', 'childrensministry'),
('Worship Ministry', 2, 2000.00, 'Ministry for the worship team', 'worshipministry'),
('Missions Ministry', 3, 1500.00, 'Ministry for the missions team', 'missionsministry');

Insert INTO roles (Role_ID, RoleName, Description) VALUES 
(0, 'BaseUser', 'Can only request to join a ministry'),
(1, 'MinistryAdmin', 'Can only see their ministry pages'),
(2, 'SuperAdmin', 'Can see all pages and edit all ministries');

Insert into users (auth0ID, minID, rID, churchID) VALUES 
('auth0|67f6cca18ffc0293d013acf9',null,2,3),
('auth0|67bcb00e834426c4e6977bf4', 4,1,3),
('auth0|67fc53397136d22bbaaf5bf3', null, 0, NULL);

INSERT INTO media (title, type, youtube_id, date, description, church_id) VALUES 
('Sunday Morning Service', 'sermon', 'sample-youtube-id-1', '2024-03-24', 'Morning worship service', 1),
('Weekly Announcements', 'announcement', 'sample-youtube-id-2', '2024-03-20', 'Updates for this week', 1);