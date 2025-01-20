-- Create Ministry table
CREATE TABLE IF NOT EXISTS Ministry (
    Ministry_ID INT PRIMARY KEY,
    MinistryName VARCHAR(100) NOT NULL,
    Church_ID INT NOT NULL,
    Budget DECIMAL(10, 2),
    FOREIGN KEY (Church_ID) REFERENCES Church(Church_ID)
);

-- Insert data into Ministry table
INSERT INTO Ministry (Ministry_ID, MinistryName, Church_ID, Budget) VALUES
(1, 'Children''s Ministry', 2, 5000.00),
(2, 'Youth Ministry', 2, 10000.00),
(3, 'Adults Ministry', 3, 7500.00);