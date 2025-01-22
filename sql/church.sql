-- Create Church table
CREATE TABLE IF NOT EXISTS Church (
    Church_ID INT PRIMARY KEY,
    ChurchName VARCHAR(100) NOT NULL,
    ChurchPhone VARCHAR(15) NOT NULL,
    StreetAddress VARCHAR(255),
    PostalCode VARCHAR(20),
    City VARCHAR(100)
);

-- Insert data into Church table
INSERT INTO Church (Church_ID, ChurchName, ChurchPhone, StreetAddress, PostalCode, City) VALUES
(2, 'First Baptist Ruston', '318-255-4628', '200 S Trenton St', '71270', 'Ruston, LA'),
(3, 'The Bridge Community Church', '318-251-1951', '2301 N Trenton St', '71270', 'Ruston, LA');