-- Create Admin table
CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID INT PRIMARY KEY,
    AdminUsername VARCHAR(50) UNIQUE NOT NULL,
    AdminPassword VARCHAR(255) NOT NULL,
    Date_Started DATE NOT NULL,
    Ministry_ID INT NOT NULL,
    SuperAdmin_ID INT,
    FOREIGN KEY (Ministry_ID) REFERENCES Ministry(Ministry_ID),
    FOREIGN KEY (SuperAdmin_ID) REFERENCES SuperAdmin(SuperAdmin_ID)
);

-- Insert data into Admin table
INSERT INTO Admin (Admin_ID, AdminUsername, AdminPassword, Date_Started, Ministry_ID, SuperAdmin_ID) VALUES
(1, 'admin1', 'admin1', '2018-07-01', 1, 1),
(2, 'admin2', 'admin2', '2013-11-21', 2, 2),
(3, 'admin3', 'admin3', '2010-01-15', 3, 1),
(4, 'admin4', 'admin4', '2015-04-12', 4, 3);