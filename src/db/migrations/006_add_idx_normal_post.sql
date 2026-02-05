CREATE INDEX idx_post_feed_2026_ASC ON post_2026(created_at, id) WHERE activo = true;
CREATE INDEX idx_post_feed_ASC ON post(created_at, id) WHERE activo = true;