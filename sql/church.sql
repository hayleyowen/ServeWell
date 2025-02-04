-- Create Church table
CREATE TABLE IF NOT EXISTS Church (
    Church_ID INT PRIMARY KEY,
    Denomination VARCHAR(100),
    ChurchName VARCHAR(100) NOT NULL,
    ChurchPhone VARCHAR(15) NOT NULL,
    ChurchEmail VARCHAR(100),
    StreetAddress VARCHAR(255),
    PostalCode VARCHAR(20),
    City VARCHAR(100),
    SuperAdmin_ID INT,
);

-- Insert data into Church table (Denomination is optional)
INSERT INTO Church (Church_ID, Denomination, ChurchName, ChurchPhone, ChurchEmail, StreetAddress, PostalCode, City) VALUES
(2, 'First Baptist Ruston', '318-255-4628', '200 S Trenton St', '71270', 'Ruston, LA'),
(3, 'The Bridge Community Church', '318-251-1951', '2301 N Trenton St', '71270', 'Ruston, LA');