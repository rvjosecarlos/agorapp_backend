CREATE TABLE user_sessions(
    id SERIAL PRIMARY KEY NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    device_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    fk_user_id INTEGER NOT NULL,
    FOREIGN KEY(fk_user_id) REFERENCES usuario(id)
);

CREATE INDEX idx_comprobar_refresh_token ON user_sessions(fk_user_id, refresh_token); 