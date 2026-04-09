CREATE OR REPLACE FUNCTION descontar_comentario()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE post
  SET total_comentarios = total_comentarios - 1
  WHERE id = OLD.fk_post_id 
    AND created_at = OLD.fk_post_created_at;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_descontar_comentario
AFTER DELETE ON comentario
FOR EACH ROW EXECUTE FUNCTION descontar_comentario();