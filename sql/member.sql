-- Create Member table
CREATE TABLE IF NOT EXISTS ChurchMember (
    Member_ID INT PRIMARY KEY,
    Fname VARCHAR(50) NOT NULL,
    Mname VARCHAR(50),
    Lname VARCHAR(50) NOT NULL,
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('member', 'admin', 'superadmin')),
    Sex CHAR(1),
    Email VARCHAR(100),
    MemberPhone VARCHAR(15) NOT NULL,
    Activity_Status VARCHAR(20),
    Church_ID INT NOT NULL,
    Church_Join_Date DATE,
    FOREIGN KEY (Church_ID) REFERENCES Church(Church_ID)
);

-- Remove test inserts as we'll create real data through the form