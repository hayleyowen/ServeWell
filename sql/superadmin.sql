-- Create SuperAdmin table
CREATE TABLE IF NOT EXISTS SuperAdmin (
    SuperAdmin_ID INT PRIMARY KEY,
    Member_ID INT NOT NULL,
    SuperUsername VARCHAR(50) UNIQUE NOT NULL,
    SuperPassword VARCHAR(255) NOT NULL,
    FOREIGN KEY (Member_ID) REFERENCES ChurchMember(Member_ID)
);


-- Insert data into SuperAdmin table
-- need to flesh this out more as well

INSERT INTO SuperAdmin (SuperAdmin_ID, Member_ID, SuperUsername, SuperPassword) VALUES
(1, 1, 'superadmin1', 'superadmin1'),
(2, 2, 'superadmin2', 'superadmin2'),
(3, 3, 'superadmin3', 'superadmin3'),
(4, 4, 'superadmin4', 'superadmin4');