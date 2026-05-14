--DROP INDEX idx_id_and_created_at;
--DROP INDEX idx_id_and_created_at_desc;
--DROP INDEX idx_post_created_at_desc;

CREATE INDEX idx_post_feed ON post(created_at DESC, id) WHERE activo = true;