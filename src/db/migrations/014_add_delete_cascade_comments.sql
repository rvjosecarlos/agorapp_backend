
ALTER TABLE comentario DROP CONSTRAINT comentario_fk_response_coment_id_fkey;

-- Para eliminar los comentarios que tiene papá. Se hace la eliminacion en cascada
ALTER TABLE comentario 
  ADD CONSTRAINT comentario_fk_response_coment_id_fkey 
  FOREIGN KEY (fk_response_coment_id) 
  REFERENCES comentario(id)
  ON DELETE CASCADE;