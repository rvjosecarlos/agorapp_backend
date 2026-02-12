ALTER TABLE usuario ALTER COLUMN fk_ubicacion_id DROP NOT NULL;
ALTER TABLE usuario ALTER COLUMN fecha_nacimiento DROP NOT NULL;
ALTER TABLE usuario ALTER COLUMN telefono DROP NOT NULL;
ALTER TABLE usuario ALTER COLUMN alias DROP NOT NULL;

CREATE INDEX idx_email_usuario ON usuario(email) WHERE activo = TRUE;