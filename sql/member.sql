-- Create Member table
CREATE TABLE IF NOT EXISTS churchmember (
    member_id SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    mname VARCHAR(50),
    lname VARCHAR(50) NOT NULL,
    sex CHAR(1),
    email VARCHAR(100),
    memberphone VARCHAR(15) NOT NULL,
    activity_status VARCHAR(20),
    church_id INTEGER NOT NULL,
    church_join_date DATE,
    CONSTRAINT churchmember_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

-- Remove test inserts as we'll create real data through the form