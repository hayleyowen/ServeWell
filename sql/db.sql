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

CREATE TABLE IF NOT EXISTS churchmember (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    mname VARCHAR(50),
    lname VARCHAR(50) NOT NULL,
    sex CHAR(1),
    email VARCHAR(100),
    memberphone VARCHAR(15) NOT NULL,
    activity_status VARCHAR(20),
    church_id INTEGER NOT NULL,
    church_join_date DATE,
    CONSTRAINT churchmember_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

CREATE TABLE IF NOT EXISTS superadmin (
    superadmin_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INTEGER NOT NULL,
    superusername VARCHAR(50) NOT NULL UNIQUE,
    superpassword VARCHAR(255) NOT NULL,
    church_id INTEGER NOT NULL,
    CONSTRAINT superadmin_member_id_fkey FOREIGN KEY (member_id) REFERENCES churchmember(member_id),
    CONSTRAINT superadmin_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
    AdminUsername VARCHAR(50) UNIQUE NOT NULL,
    AdminPassword VARCHAR(255) NOT NULL,
    Date_Started DATE NOT NULL,
    Ministry_ID INT NOT NULL,
    SuperAdmin_ID INT,
    FOREIGN KEY (Ministry_ID) REFERENCES ministry(Ministry_ID),
    FOREIGN KEY (SuperAdmin_ID) REFERENCES superadmin(SuperAdmin_ID)
);

CREATE TABLE IF NOT EXISTS Ministry_Admin (
    Admin_ID INT PRIMARY KEY,
    Ministry_ID INT NOT NULL,
    Member_ID INT NOT NULL,
    Admin_Start_Date DATE NOT NULL,
    FOREIGN KEY (Ministry_ID) REFERENCES ministry(Ministry_ID),
    FOREIGN KEY (Member_ID) REFERENCES churchmember(Member_ID)
);

CREATE TABLE uploaded_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_name TEXT NOT NULL,
    file_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tab_name VARCHAR(255) NOT NULL
);


-- Inserting data into the tables

INSERT INTO church (churchname, churchphone, streetaddress, postalcode, city, denomination, email) 
VALUES ('Temple Baptist Church', '318-555-5555', '1234 Main St', '71111', 'Shreveport', 'Baptist', 'hello@temple.life'),
('First United Methodist Church', '318-555-5555', '1234 Main St', '71111', 'Shreveport', 'Methodist', 'hello@first.united'),
('St. Mary''s Catholic Church', '318-555-5555', '1234 Main St', '71111', 'Shreveport', 'Catholic', 'hello@st.marys');

INSERT INTO ministry (ministryname, church_id, budget, description, url_path) VALUES 
('Youth Ministry', 1, 1000.00, 'Ministry for the youth', 'youthministry'),
('Children''s Ministry', 1, 500.00, 'Ministry for the children', 'childrensministry'),
('Worship Ministry', 2, 2000.00, 'Ministry for the worship team', 'worshipministry'),
('Missions Ministry', 3, 1500.00, 'Ministry for the missions team', 'missionsministry');

INSERT INTO churchmember (fname, mname, lname, sex, email, memberphone, activity_status, church_id, church_join_date) VALUES 
('John', 'Doe', 'Smith', 'M', 'jsmith@email.com', '318-555-5444', 'Active', 1, '2020-01-01'),
('Jane', 'Doe', 'Smith', 'F', 'jdsmith@email.com', '318-555-5555', 'Active', 1, '2010-01-01'),
('Mary', 'Ann', 'Johnson', 'F', 'mjohnson@email.com', '318-555-5333', 'Active', 2, '2021-01-01'),
('Michael', 'David', 'Brown', 'M', 'mbrown@email.com', '318-555-5222', 'Active', 3, '2019-01-01');

INSERT INTO superadmin (member_id, superusername, superpassword, church_id) VALUES 
(1, 'superadmin1', 'password1', 1),
(2, 'superadmin2', 'password2', 2),
(3, 'superadmin3', 'password3', 3);

INSERT INTO Admin (AdminUsername, AdminPassword, Date_Started, Ministry_ID, SuperAdmin_ID) VALUES 
('admin1', 'password1', '2020-01-01', 1, 1),
('admin2', 'password2', '2021-01-01', 2, 2),
('admin3', 'password3', '2019-01-01', 3, 3);