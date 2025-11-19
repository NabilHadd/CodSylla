CREATE TABLE usuario (
  rut VARCHAR(12) NOT NULL,
  email VARCHAR(100) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  PRIMARY KEY (rut)
);

CREATE TABLE semestre (
  id_semestre VARCHAR(10) NOT NULL,
  tipo_sem VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_semestre)
);

CREATE TABLE ramo (
  codigo VARCHAR(10) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  creditos INT NOT NULL,
  nivel VARCHAR(10),
  PRIMARY KEY (codigo)
);

CREATE TABLE historial_academico (
  rut_alumno VARCHAR(12) NOT NULL,
  codigo_ramo VARCHAR(10) NOT NULL,
  sem_cursado VARCHAR(10) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  nota NUMERIC(4,2),
  PRIMARY KEY (rut_alumno, codigo_ramo, sem_cursado),
  FOREIGN KEY (rut_alumno) REFERENCES usuario (rut),
  FOREIGN KEY (codigo_ramo) REFERENCES ramo (codigo),
  FOREIGN KEY (sem_cursado) REFERENCES semestre (id_semestre)
);

CREATE TABLE carrera (
  codigo VARCHAR(10) NOT NULL,
  catalogo VARCHAR(10) NOT NULL,
  nombre VARCHAR(100),
  PRIMARY KEY (codigo, catalogo)
);

CREATE TABLE alumno_carrera (
  rut_alumno VARCHAR(12) NOT NULL,
  codigo_carrera VARCHAR(10) NOT NULL,
  catalogo VARCHAR(10) NOT NULL,
  PRIMARY KEY (rut_alumno, codigo_carrera, catalogo),
  FOREIGN KEY (rut_alumno) REFERENCES usuario (rut),
  FOREIGN KEY (codigo_carrera, catalogo) REFERENCES carrera (codigo, catalogo)
);

CREATE TABLE syllabus (
  codigo VARCHAR(10) NOT NULL,
  catalogo VARCHAR(10) NOT NULL,
  PRIMARY KEY (codigo, catalogo),
  FOREIGN KEY (codigo, catalogo) REFERENCES carrera (codigo, catalogo)
);

CREATE TABLE ramos_syllabus (
  codigo_ramo VARCHAR(10) NOT NULL,
  codigo_syll VARCHAR(10) NOT NULL,
  catalogo VARCHAR(10) NOT NULL,
  PRIMARY KEY (codigo_ramo, codigo_syll, catalogo),
  FOREIGN KEY (codigo_ramo) REFERENCES ramo (codigo),
  FOREIGN KEY (codigo_syll, catalogo) REFERENCES carrera (codigo, catalogo)
);

CREATE TABLE prerequisitos (
  codigo_ramo VARCHAR(10) NOT NULL,
  codigo_preramo VARCHAR(10) NOT NULL,
  PRIMARY KEY (codigo_ramo, codigo_preramo),
  FOREIGN KEY (codigo_ramo) REFERENCES ramo (codigo),
  FOREIGN KEY (codigo_preramo) REFERENCES ramo (codigo)
);

CREATE TABLE planificacion (
  rut_alumno VARCHAR(12) NOT NULL,
  fecha TIMESTAMP NOT NULL,
  nombre_plan VARCHAR(100),
  sem_plan VARCHAR(10) NOT NULL,
  ranking INT NOT NULL,
  PRIMARY KEY (rut_alumno, fecha),
  FOREIGN KEY (rut_alumno) REFERENCES usuario (rut)
);

CREATE TABLE audit_log (
  fecha TIMESTAMP NOT NULL,
  rut_usuario VARCHAR(12) NOT NULL,
  accion VARCHAR(100),
  PRIMARY KEY (rut_usuario, fecha),
  FOREIGN KEY (rut_usuario) REFERENCES usuario (rut)
);


-- Planificacion: sem_plan referencia a semestre
ALTER TABLE planificacion
ADD CONSTRAINT fk_planificacion_semestre
FOREIGN KEY (sem_plan)
REFERENCES semestre (id_semestre);


--Para rellenar semestres.
--Para rellenar semestres.
DO $$
DECLARE
  y INT;
BEGIN
  FOR y IN 2000..2100 LOOP
    INSERT INTO semestre VALUES (y || '10', 'Primer semestre');
    INSERT INTO semestre VALUES (y || '20', 'Segundo semestre');
    INSERT INTO semestre VALUES (y || '15', 'Verano');
    INSERT INTO semestre VALUES (y || '25', 'Invierno');
  END LOOP;
END $$;



-- Función que se ejecutará al insertar una carrera
CREATE OR REPLACE FUNCTION insertar_syllabus()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO syllabus (codigo, catalogo)
  VALUES (NEW.codigo, NEW.catalogo);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger asociado a la tabla carrera
CREATE TRIGGER tr_insertar_syllabus
AFTER INSERT ON carrera
FOR EACH ROW
EXECUTE FUNCTION insertar_syllabus();

--Para limpiar las tablas
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
    END LOOP;
END $$;


--consulta para ver los prerequisitos
SELECT
    r.nombre AS ramo,
    rp.nombre AS prerequisito
FROM
    ramo r
LEFT JOIN prerequisitos p
    ON r.codigo = p.codigo_ramo
LEFT JOIN ramo rp
    ON p.codigo_preramo = rp.codigo
ORDER BY
    r.nombre,
    rp.nombre;