CREATE TABLE IF NOT EXISTS ministry (
    ministry_id SERIAL PRIMARY KEY,
    ministryname VARCHAR(100) NOT NULL,
    church_id INT NOT NULL,
    budget DECIMAL(10, 2),
    description TEXT,
    FOREIGN KEY (church_id) REFERENCES church(church_id)
);

-- Insert sample data
INSERT INTO ministry (ministryname, church_id, budget, description) VALUES
('Children''s Ministry', 1, 5000.00, 'Ministry focused on children''s spiritual growth'),
('Youth Ministry', 1, 10000.00, 'Engaging young people in church activities'),
('Adults Ministry', 1, 7500.00, 'Adult spiritual development and fellowship');