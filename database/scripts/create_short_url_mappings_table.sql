CREATE TABLE short_url_mappings (
    id SERIAL PRIMARY KEY,
    long_url VARCHAR NOT NULL,
    short_url VARCHAR(8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_short_url UNIQUE (short_url)
);