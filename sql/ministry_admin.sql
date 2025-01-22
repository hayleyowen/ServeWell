-- Create Ministry_Admin table
CREATE TABLE IF NOT EXISTS Ministry_Admin (
    Admin_ID INT PRIMARY KEY,
    Ministry_ID INT NOT NULL,
    Member_ID INT NOT NULL,
    Admin_Start_Date DATE NOT NULL,
    FOREIGN KEY (Ministry_ID) REFERENCES Ministry(Ministry_ID),
    FOREIGN KEY (Member_ID) REFERENCES ChurchMember(Member_ID)
);

-- Insert data into Ministry_Admin table
-- Need to flesh this out more