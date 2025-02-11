Create database ServeWell;
Use ServeWell;

CREATE TABLE church (
    church_id INT PRIMARY KEY,
    churchname VARCHAR(100) NOT NULL,
    churchphone VARCHAR(15) NOT NULL,
    streetaddress VARCHAR(255),
    postalcode VARCHAR(20),
    city VARCHAR(100),
    denomination VARCHAR(100),
    email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ministry (
    ministry_id INT PRIMARY KEY,
    ministryname VARCHAR(100) NOT NULL,
    church_id INT NOT NULL,
    budget DECIMAL(10, 2),
    description TEXT,
    CONSTRAINT ministry_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

CREATE TABLE IF NOT EXISTS churchmember (
    member_id INT PRIMARY KEY,
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
    superadmin_id INT PRIMARY KEY,
    member_id INTEGER NOT NULL,
    superusername VARCHAR(50) NOT NULL UNIQUE,
    superpassword VARCHAR(255) NOT NULL,
    church_id INTEGER NOT NULL,
    CONSTRAINT superadmin_member_id_fkey FOREIGN KEY (member_id) REFERENCES churchmember(member_id),
    CONSTRAINT superadmin_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID INT PRIMARY KEY,
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

CREATE TABLE files (
    id INT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_data BYTEA NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);