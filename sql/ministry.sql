CREATE TABLE IF NOT EXISTS ministry (
    ministry_id SERIAL PRIMARY KEY,
    ministryname VARCHAR(100) NOT NULL,
    church_id INT NOT NULL,
    budget DECIMAL(10, 2),
    description TEXT,
    FOREIGN KEY (church_id) REFERENCES church(church_id)
);

-- Insert data into ministry table (no need to specify ministry_id)
INSERT INTO ministry (ministryname, church_id, budget) VALUES
('Children''s Ministry', 2, 5000.00),
('Youth Ministry', 2, 10000.00),
('Adults Ministry', 3, 7500.00);