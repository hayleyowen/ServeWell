-- Create Admin table
CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID INT PRIMARY KEY,
    AdminUsername VARCHAR(50) UNIQUE NOT NULL,
    AdminPassword VARCHAR(255) NOT NULL,
    Date_Started DATE NOT NULL,
    Mi_ID INT,
    SA_ID INT,
    Me_ID INT,
    Approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Mi_ID) REFERENCES Ministry(Ministry_ID),
    FOREIGN KEY (Me_ID) REFERENCES ChurchMember(Member_ID),
    FOREIGN KEY (SA_ID) REFERENCES SuperAdmin(SuperAdmin_ID)
);

-- Insert data into Admin table
INSERT INTO Admin (Admin_ID, AdminUsername, AdminPassword, Date_Started, Ministry_ID, SuperAdmin_ID) VALUES
(1, 'admin1', 'admin1', '2018-07-01', NULL, 1),
(2, 'admin2', 'admin2', '2013-11-21', NULL, 2),
(3, 'admin3', 'admin3', '2010-01-15', NULL, 1),
(4, 'admin4', 'admin4', '2015-04-12', NULL, 3);

When a user (admin) creates an account on the website,
they should be given a choice to select a ministry 
that they want to join. 

When a user requests a ministry, that should be sent to
the superadmin for approval. 