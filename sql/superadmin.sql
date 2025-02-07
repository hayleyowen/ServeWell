-- Create SuperAdmin table
CREATE TABLE IF NOT EXISTS superadmin (
    superadmin_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    superusername VARCHAR(50) NOT NULL UNIQUE,
    superpassword VARCHAR(255) NOT NULL,
    church_id INTEGER NOT NULL,
    CONSTRAINT superadmin_member_id_fkey FOREIGN KEY (member_id) REFERENCES churchmember(member_id),
    CONSTRAINT superadmin_church_id_fkey FOREIGN KEY (church_id) REFERENCES church(church_id)
);

-- No need for test inserts right now since we'll create records through the form