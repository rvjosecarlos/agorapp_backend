CREATE TABLE user_token_notification(
    id SERIAL PRIMARY KEY NOT NULL,
    token TEXT NOT NULL,
    fk_usuario_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

ALTER TABLE user_token_notification ADD CONSTRAINT notification_fk_usuario UNIQUE (fk_usuario_id, token);

CREATE INDEX idx_usuario_id ON user_token_notification(token);