/* ==============
    EXTENSIONES
=============== */

CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================================
-- Enum para columna tipo de tabla plan
-- =====================================

CREATE TYPE enum_tipo_plan AS ENUM('gobierno', 'privado');
CREATE TYPE enum_tipo_organizacion AS ENUM('gubernamental','privada');
CREATE TYPE enum_ambito_organizacion AS ENUM('municipal', 'estatal', 'todas');
CREATE TYPE enum_rol_usuario_organizacion AS ENUM('usuario','propietario','admin','supervisor','operador');
CREATE TYPE enum_tipo_post AS ENUM('reporte','publicidad','aviso');
CREATE TYPE enum_post_historial_estado_estados AS ENUM('asignado','pendiente','en progreso','resuelto');
CREATE TYPE enum_notificacion_tipo AS ENUM('comentario','actualizacion','aviso','like');

/* ==================
        TABLAS
=================== */

-- =================
-- Tabla Ubicacion
-- =================

CREATE TABLE IF NOT EXISTS ubicacion (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    colonia VARCHAR(255) NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    alcaldia VARCHAR(255),
    estado VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    geom geography(Point, 4326) NOT NULL,
    search_vector tsvector NOT NULL,
    service_georeverse VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ubicacion_geom ON ubicacion USING GIST (geom);
CREATE INDEX idx_ubicacion_municipio ON ubicacion(municipio);
CREATE INDEX idx_ubicacion_estado ON ubicacion(estado);
CREATE INDEX idx_ubicacion_colonia ON ubicacion(colonia);
CREATE INDEX idx_ubicacion_search_vector ON ubicacion USING GIN (search_vector);

-- =================
-- Tabla plan
-- =================

CREATE TABLE IF NOT EXISTS plan (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo enum_tipo_plan NOT NULL,
    precio NUMERIC(7,2) NOT NULL,
    capacidad_usuarios SMALLINT NOT NULL,
    features JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================
-- Tabla Organizacion
-- ===================

CREATE TABLE organizacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    tipo enum_tipo_organizacion NOT NULL,
    ambito enum_ambito_organizacion NOT NULL,
    fecha_inicio_plan DATE NOT NULL,
    fecha_fin_plan DATE NOT NULL,
    fk_plan_id INT NOT NULL,
    fk_ubicacion_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_plan_id) REFERENCES plan(id),
    FOREIGN KEY (fk_ubicacion_id) REFERENCES ubicacion(id)
);

CREATE INDEX idx_organizacion_fk_plan_id ON organizacion(fk_plan_id);
CREATE INDEX idx_organizacion_fk_ubicacion_id ON organizacion(fk_ubicacion_id);

-- =====================
-- Tabla departamento
-- =====================

CREATE TABLE departamento(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fk_organizacion_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_organizacion_id) REFERENCES organizacion(id)
);

CREATE INDEX idx_departamento_fk_organizacion_id ON departamento(fk_organizacion_id);

-- =====================
-- Tabla proveedor_esp
-- =====================

CREATE TABLE IF NOT EXISTS proveedor_esp (
    id SERIAL PRIMARY KEY,
    nombre  VARCHAR(255) NOT NULL,
    esp_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nombre_proveedor_esp ON proveedor_esp(nombre);

-- ======================
-- Tabla usuario
-- ======================

CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    fk_proveedor_esp_id INT,
    fk_ubicacion_id INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    curp CHAR(18) UNIQUE,
    alias VARCHAR(255) UNIQUE NOT NULL,
    url_img TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY(fk_proveedor_esp_id) REFERENCES proveedor_esp(id),
    FOREIGN KEY(fk_ubicacion_id) REFERENCES ubicacion(id)
);

CREATE INDEX idx_usuario_fk_ubicacion_id ON usuario(fk_ubicacion_id);
CREATE INDEX idx_usuario_fk_proveedor_esp_id ON usuario(fk_proveedor_esp_id);

-- ===========================
-- Tabla usuario_organizacion
-- ===========================

CREATE TABLE usuario_organizacion(
    id SERIAL PRIMARY KEY,
    rol enum_rol_usuario_organizacion NOT NULL,
    fecha_alta DATE NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fk_departamento_id INT NOT NULL,
    fk_usuario_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_departamento_id) REFERENCES departamento(id),
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id)
);

ALTER TABLE usuario_organizacion ADD CONSTRAINT usuario_unico_departamento UNIQUE (fk_usuario_id, fk_departamento_id);

CREATE INDEX idx_usuario_organizacion_fk_departamento_id ON usuario_organizacion(fk_departamento_id);
CREATE INDEX idx_usuario_organizacion_fk_usuario_id ON usuario_organizacion(fk_usuario_id);

-- ===========================
-- Tabla categoria
-- ===========================

CREATE TABLE categoria(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================
-- Tabla post
-- ===========================

CREATE TABLE post(
    id BIGSERIAL,
    tipo enum_tipo_post NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    fk_categoria_id INT,
    descripcion TEXT NOT NULL,
    estilos TEXT,
    total_comentarios INT NOT NULL DEFAULT 0,
    total_likes INT NOT NULL DEFAULT 0,
    total_compartidos INT NOT NULL DEFAULT 0,
    link TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fk_ubicacion_id INT,
    fk_usuario_id INT NOT NULL,
    fk_organizacion_id INT,
    PRIMARY KEY (id, created_at),
    UNIQUE(id, created_at),
    FOREIGN KEY (fk_ubicacion_id) REFERENCES ubicacion(id),
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (fk_categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (fk_organizacion_id) REFERENCES organizacion(id)
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_post_tipo ON post(tipo) WHERE activo = true;
CREATE INDEX idx_fk_categoria_id ON post(fk_categoria_id) WHERE activo = true;
--CREATE INDEX idx_id_and_created_at ON post(id, created_at) WHERE activo = true;
--CREATE INDEX idx_id_and_created_at_desc ON post(id, created_at DESC) WHERE activo = true;
--CREATE INDEX idx_post_created_at_desc ON post(created_at, activo DESC); 
CREATE INDEX idx_fk_ubicacion_id ON post(fk_ubicacion_id);
CREATE INDEX idx_fk_usuario_id ON post(fk_usuario_id);
CREATE INDEX idx_fk_organizacion_id_post ON post(fk_organizacion_id);

-- ==============================
-- Particiones de la tabla post
-- ==============================

CREATE TABLE post_2025 PARTITION OF post FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE post_2026 PARTITION OF post FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE post_2027 PARTITION OF post FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
CREATE TABLE post_2028 PARTITION OF post FOR VALUES FROM ('2028-01-01') TO ('2029-01-01');
CREATE TABLE post_2029 PARTITION OF post FOR VALUES FROM ('2029-01-01') TO ('2030-01-01');
CREATE TABLE post_2030 PARTITION OF post FOR VALUES FROM ('2030-01-01') TO ('2031-01-01');
CREATE TABLE post_2031 PARTITION OF post FOR VALUES FROM ('2031-01-01') TO ('2032-01-01');

-- ===========================
-- Tabla post_imagenes
-- ===========================

CREATE TABLE post_imagenes(
    id SERIAL PRIMARY KEY,
    fk_post_id BIGINT NOT NULL,
    fk_post_created_at TIMESTAMPTZ NOT NULL,
    id_cloudinary VARCHAR(255) NOT NULL,
    url_img TEXT NOT NULL,
    orden INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_post_id, fk_post_created_at) REFERENCES post(id, created_at)
);

CREATE INDEX idx_post_imagenes_fk_post_id ON post_imagenes(fk_post_id, fk_post_created_at);

-- ===========================
-- Tabla asignacion_reportes
-- ===========================

CREATE TABLE asignacion_reportes(
    id SERIAL PRIMARY KEY,
    bitacora TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fk_post_id INT NOT NULL,
    fk_post_created_at TIMESTAMPTZ NOT NULL,
    fk_usuario_asignado_organizacion_id INT NOT NULL,
    fk_usuario_designador_organizacion_id INT NOT NULL,
    FOREIGN KEY (fk_post_id, fk_post_created_at) REFERENCES post(id, created_at),
    FOREIGN KEY (fk_usuario_asignado_organizacion_id) REFERENCES usuario_organizacion(id),
    FOREIGN KEY (fk_usuario_designador_organizacion_id) REFERENCES usuario_organizacion(id)
);

CREATE INDEX idx_asignacion_reportes_fk_post_id ON asignacion_reportes(fk_post_id, fk_post_created_at);
CREATE INDEX idx_asignacion_reportes_fk_usuario_asignado ON asignacion_reportes(fk_usuario_asignado_organizacion_id);
CREATE INDEX idx_asignacion_reportes_fk_usuario_designador ON asignacion_reportes(fk_usuario_designador_organizacion_id);

-- =============================
-- Tabla post_historial_estado
-- =============================

CREATE TABLE post_historial_estado(
    id SERIAL PRIMARY KEY,
    estado enum_post_historial_estado_estados NOT NULL,
    descripcion TEXT,
    fk_usuario_id INT NOT NULL,
    fk_post_id INT NOT NULL,
    fk_post_created_at TIMESTAMPTZ NOT NULL,
    editado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (fk_post_id, fk_post_created_at) REFERENCES post(id, created_at)
);

--CREATE INDEX idx_post_historial_estado_fk_usuario_id ON post_historial_estado(fk_usuario_id);
--CREATE INDEX idx_post_historial_estado_fk_post_id ON post_historial_estado(fk_post_id, fk_post_created_at, activo);
--CREATE INDEX idx_post_historial_estado_estado_activo ON post_historial_estado(estado, activo);

-- =============================
-- Tabla comentario
-- =============================

CREATE TABLE comentario(
    id SERIAL PRIMARY KEY,
    comentario TEXT NOT NULL,
    fk_response_coment_id INT,
    fk_post_id INT NOT NULL,
    fk_post_created_at TIMESTAMPTZ NOT NULL,
    fk_usuario_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_response_coment_id) REFERENCES comentario(id),
    FOREIGN KEY (fk_post_id, fk_post_created_at) REFERENCES post(id, created_at),
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id)
);

CREATE INDEX idx_comentario_fk_response_coment_id ON comentario(fk_response_coment_id);
CREATE INDEX idx_comentario_fk_post_id ON comentario(fk_post_id, fk_post_created_at);
CREATE INDEX idx_comentario_fk_usuario_id ON comentario(fk_usuario_id);

-- =============================
-- Tabla like
-- =============================

CREATE TABLE post_like(
    id SERIAL PRIMARY KEY,
    fk_post_id INT NOT NULL,
    fk_post_created_at TIMESTAMPTZ NOT NULL,
    fk_usuario_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE post_like ADD CONSTRAINT like_unico UNIQUE (fk_post_id, fk_usuario_id);

CREATE INDEX idx_like_fk_post_id ON post_like(fk_post_id, fk_post_created_at);
CREATE INDEX idx_like_fk_usuario_id ON post_like(fk_post_id, fk_post_created_at, fk_usuario_id);

-- =============================
-- Tabla notificacion
-- =============================

CREATE TABLE notificacion(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo enum_notificacion_tipo NOT NULL,
    fk_post_id INT,
    fk_post_created_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_post_id, fk_post_created_at) REFERENCES post(id, created_at)
);

CREATE INDEX idx_notificacion_fk_post_id ON notificacion(fk_post_id, fk_post_created_at);
CREATE INDEX idx_notificacion_tipo ON notificacion(tipo);


-- =============================
-- Tabla receptores
-- =============================

CREATE TABLE receptores(
    id SERIAL PRIMARY KEY,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    fk_usuario_id INT NOT NULL,
    fk_notificacion_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (fk_notificacion_id) REFERENCES notificacion(id)
);

CREATE INDEX idx_receptores_fk_usuario_id ON receptores(fk_usuario_id);
CREATE INDEX idx_receptores_fk_notificacion_id ON receptores(fk_notificacion_id);

-- =============================
-- Tabla migraciones
-- =============================

CREATE TABLE migraciones(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* ====================
        FUNCIONES
==================== */

-- ==========================================
-- Actualiza updated_at de todas las tablas
-- ==========================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

-- ===============================================================================
-- Crea y actualiza el campo tsvector para busquedas por direccion y descripcion 
-- ===============================================================================

CREATE OR REPLACE FUNCTION llenar_columna_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := setweight( to_tsvector('spanish', coalesce(NEW.direccion, '')), 'A') ||
                         setweight( to_tsvector('spanish', coalesce(NEW.calle, '')), 'B') ||
                         setweight( to_tsvector('spanish', coalesce(NEW.colonia, '')), 'C');
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


/* ==================
        TRIGGERS
=================== */

-- ==================================================================
-- Trigger actualizar columna update_at de ubicacion y search_vector
-- ==================================================================

CREATE TRIGGER trigger_ubicacion_search_vector
BEFORE INSERT OR UPDATE
ON ubicacion
FOR EACH ROW
EXECUTE FUNCTION llenar_columna_search_vector();

-- =====================================================
-- Trigger actualizar columna update_at de organizacion
-- =====================================================

CREATE TRIGGER trigger_updated_at_organizacion
BEFORE UPDATE
ON organizacion
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ======================================================
-- Trigger actualizar columna update_at de departamento
-- ======================================================

CREATE TRIGGER trigger_updated_at_departamento
BEFORE UPDATE
ON departamento
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ==================================================
-- Trigger actualizar columna update_at de plan
-- ==================================================

CREATE TRIGGER trigger_updated_at_plan
BEFORE UPDATE
ON plan
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ======================================================
-- Trigger actualizar columna update_at de proveedor_esp
-- ======================================================

CREATE TRIGGER trigger_updated_at_proveedor_esp
BEFORE UPDATE
ON proveedor_esp
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ======================================================
-- Trigger actualizar columna update_at de usuarios
-- ======================================================

CREATE TRIGGER trigger_updated_at_usuarios
BEFORE UPDATE
ON usuario
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- =============================================================
-- Trigger actualizar columna update_at de usuario_organizacion
-- =============================================================

CREATE TRIGGER trigger_updated_at_usuario_organizacion
BEFORE UPDATE
ON usuario_organizacion
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- =============================================================
-- Trigger actualizar columna update_at de post
-- =============================================================

CREATE TRIGGER trigger_updated_at_post
BEFORE UPDATE
ON post
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- =============================================================
-- Trigger actualizar columna update_at de post_imagenes
-- =============================================================

CREATE TRIGGER trigger_updated_at_post_imagenes
BEFORE UPDATE
ON post_imagenes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ================================================================
-- Trigger actualizar columna updated_at de post_historial_estado
-- ================================================================

CREATE TRIGGER trigger_updated_at_post_historial_estado
BEFORE UPDATE
ON post_historial_estado
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ==================================================
-- Trigger actualizar columna update_at comentario
-- ==================================================

CREATE TRIGGER trigger_updated_at_comentario
BEFORE UPDATE
ON comentario
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ===================================================
-- Trigger actualizar columna update_at de receptores
-- ===================================================

CREATE TRIGGER trigger_updated_at_receptores
BEFORE UPDATE   
ON receptores
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();