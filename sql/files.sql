CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    file_data BYTEA NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
