-- Crear tabla Cliente
CREATE TABLE Cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    cargo_contacto VARCHAR(255) NOT NULL,
    correo_contacto VARCHAR(255) NOT NULL,
    telefono_contacto INTEGER NOT NULL
);

-- Crear tabla Usuario
CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    rut VARCHAR(20) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    area_trabajo VARCHAR(100) NOT NULL CHECK (
        area_trabajo in ('Gerencia', 'Comercial', 'Adquisiciones', 'Transportes',
       'Mantención', 'Gerente Producción', 'Logistica', 'Diseño',
       'Jefe Producción', 'Supervisor Terreno', 'Bodega Pañol',
       'Control Calidad', 'Prevención Riesgo', 'Producción', 'RRHH',
       'Facturación y Cobranzas')
    ),
    contrasenia VARCHAR(255) NOT NULL,
    privilegio INTEGER NOT NULL, -- PRIVILEGIO, SUPERUSER 4, 
                                --crear (registros nuevos) Y MODIFICADOR 3 
                                --elimina ? DUDA
                                --MODIFICA 2
                                --VISITANTE (reducido a la persona) 1 
    estado_usuario INTEGER NOT NULL
);


-- Crear tabla Contactos
CREATE TABLE Contactos (
    id_contacto SERIAL PRIMARY KEY,
    nombre_contacto VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL
);


-- Tabla bd_accesible (Bases de Datos)
CREATE TABLE bd_accesible (
    id_bd SERIAL PRIMARY KEY,
    nombre_bd VARCHAR(50) NOT NULL UNIQUE,
    filtros_bd TEXT[]
);

-- Tabla intermedia usuario_bd (relación muchos a muchos)
CREATE TABLE usuario_bd (
    id_usuario INTEGER NOT NULL REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_bd INTEGER NOT NULL REFERENCES bd_accesible(id_bd) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_bd)
);

-- Tabla vistas
CREATE TABLE vistas (
    id_vista SERIAL PRIMARY KEY,
    nombre_vista VARCHAR(50) NOT NULL,
    filtros_vista TEXT[],
    id_bd INTEGER NOT NULL REFERENCES bd_accesible(id_bd) ON DELETE CASCADE
);

-- Crear tabla Proyecto
CREATE TABLE Proyecto (
    id_proyecto SERIAL PRIMARY KEY,
    nombre_proyecto VARCHAR(255) NOT NULL,
    tipo_cliente VARCHAR(100) NOT NULL CHECK (
        tipo_cliente IN ('constructora','particular','hospitales','cm','otros','retail')
    ),
    estado_comercial VARCHAR(100) NOT NULL CHECK(
        estado_comercial IN ('cotizar', 'rechazado', 'cotizado', 'adjudicado', 'terminado')
    ),
    info VARCHAR(2) NOT NULL CHECK (
        info IN ('si','no')
    ),
    cliente INTEGER REFERENCES Cliente(id_cliente) ON DELETE SET NULL,
    monto_UF INTEGER,
    monto_clp INTEGER,
    tipo_Proyecto VARCHAR(100),
    cant_Inmuebles INTEGER,
    pisos INTEGER,
    torres INTEGER,
    partidas TEXT[],
    tipo_contrato TEXT[] CHECK (
        tipo_contrato <@ ARRAY['instalacion','suministro']
    ),
    fecha_solicitud_cotizacion DATE,
    fecha_deadline DATE,
    tipologia_piloto VARCHAR(255),
    numeros_piloto VARCHAR(50),
    fecha_piloto DATE,
    fase_proyecto VARCHAR(50) CHECK(
        fase_proyecto in ('ejecucion', 'estudio')
    ),
    fecha_ejec_inicio_obra DATE,
    fecha_ejec_fin_obra DATE,
    adjuntar_cotizacion_enviada TEXT, --ADJUNTAR ARCHIVO
    probabilidad_cierre VARCHAR(20) CHECK (
        probabilidad_cierre IN ('muy baja','baja','media','alta','muy alta')
    ),
    motivo_perdida_proyecto VARCHAR(255),
    programa_entrega_cliente TEXT, --ADJUNTAR ARCHIVO
    adjuntar_planos TEXT, -- ADJUNTAR PLANOS
    one_pager TEXT, -- NO SE QUE ES, PREGUNTAR
    instalacion_despacho VARCHAR(255),
    diseñador_asignado VARCHAR(255),
    pagina_web_proyecto VARCHAR(255),
    ubicacion_google_maps VARCHAR(255),
    region VARCHAR(100),
    comuna VARCHAR(100),
    direccion_proyecto VARCHAR(100),
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responsable_comercial INTEGER REFERENCES Usuario(id_usuario) ON DELETE SET NULL,
    modificacion_por INTEGER REFERENCES Usuario(id_usuario) ON DELETE SET NULL,
    gte_proyecto_contacto INTEGER REFERENCES Contactos(id_contacto) ON DELETE SET NULL,
    adm_obra INTEGER REFERENCES Contactos(id_contacto) ON DELETE SET NULL,
    estado_proyecto INTEGER
);