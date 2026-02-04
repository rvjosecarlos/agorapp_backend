DROP INDEX idx_post_historial_estado_fk_usuario_id;
DROP INDEX idx_post_historial_estado_fk_post_id;
DROP INDEX idx_post_historial_estado_estado_activo;

CREATE INDEX idx_post_historial_estado_fk_usuario_id ON post_historial_estado(fk_usuario_id) WHERE activo = TRUE;
CREATE INDEX idx_post_historial_estado_fk_post_id ON post_historial_estado(fk_post_id, fk_post_created_at) WHERE activo = TRUE;
CREATE INDEX idx_post_historial_estado_estado_activo ON post_historial_estado(estado) WHERE activo = TRUE;