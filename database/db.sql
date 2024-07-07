CREATE TABLE IF NOT EXISTS users(
    user_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT
);