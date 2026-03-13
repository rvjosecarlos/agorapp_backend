CREATE TYPE enum_tipo_plataforma AS ENUM('firebase', 'expo');

ALTER TABLE user_token_notification ALTER COLUMN platform TYPE enum_tipo_plataforma
USING platform::enum_tipo_plataforma;