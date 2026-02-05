DROP INDEX idx_ubicacion_geom;
CREATE INDEX idx_ubicacion_geom ON ubicacion USING GIST (geom::geography);