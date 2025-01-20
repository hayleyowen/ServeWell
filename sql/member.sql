-- Create Member table
CREATE TABLE IF NOT EXISTS ChurchMember (
    Member_ID INT PRIMARY KEY,
    Fname VARCHAR(50) NOT NULL,
    Mname VARCHAR(50),
    Lname VARCHAR(50) NOT NULL,
    Sex CHAR(1),
    Email VARCHAR(100),
    MemberPhone VARCHAR(15) NOT NULL,
    Activity_Status VARCHAR(20),
    Church_ID INT NOT NULL,
    Church_Join_Date DATE,
    FOREIGN KEY (Church_ID) REFERENCES Church(Church_ID)
);

-- Insert data into ChurchMember table
INSERT INTO ChurchMember (Member_ID, Fname, Mname, Lname, Sex, Email, MemberPhone, Activity_Status, Church_ID, Church_Join_Date) VALUES
(1, 'John', 'Doe', 'Smith', 'M', 'jsmith@email.com', '318-867-5309', 'Active', 2, '2019-01-01'),
(2, 'Jane', 'Doe', 'Smith', 'F', 'jdsmith@email.com', '318-867-5310', 'Active', 2, '2019-01-01'),
(3, 'John', 'Doe', 'Jones', 'M', 'jjones@email.com', '318-867-5311', 'Active', 3, '2019-01-01'),
(4, 'Jane', 'Doe', 'Jones', 'F', 'jdjones@email.com', '318-867-5312', 'Active', 3, '2019-01-01');