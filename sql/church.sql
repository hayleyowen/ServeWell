CREATE TABLE church (
    church_id SERIAL PRIMARY KEY,
    churchname VARCHAR(100) NOT NULL,
    churchphone VARCHAR(15) NOT NULL,
    streetaddress VARCHAR(255),
    postalcode VARCHAR(20),
    city VARCHAR(100),
    denomination VARCHAR(100),
    email VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX church_pkey ON church USING BTREE (church_id);