-- CreateTable
CREATE TABLE "alumno_carrera" (
    "rut_alumno" VARCHAR(12) NOT NULL,
    "codigo_carrera" VARCHAR(10) NOT NULL,
    "catalogo" VARCHAR(10) NOT NULL,

    CONSTRAINT "alumno_carrera_pkey" PRIMARY KEY ("rut_alumno","codigo_carrera","catalogo")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "fecha" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rut_usuario" VARCHAR(12) NOT NULL,
    "accion" VARCHAR(100),

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("rut_usuario","fecha")
);

-- CreateTable
CREATE TABLE "carrera" (
    "codigo" VARCHAR(10) NOT NULL,
    "catalogo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100),

    CONSTRAINT "carrera_pkey" PRIMARY KEY ("codigo","catalogo")
);

-- CreateTable
CREATE TABLE "historial_academico" (
    "rut_alumno" VARCHAR(12) NOT NULL,
    "codigo_ramo" VARCHAR(10) NOT NULL,
    "sem_cursado" VARCHAR(10) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "nota" DECIMAL(4,2),

    CONSTRAINT "historial_academico_pkey" PRIMARY KEY ("rut_alumno","codigo_ramo","sem_cursado")
);

-- CreateTable
CREATE TABLE "planificacion" (
    "rut_alumno" VARCHAR(12) NOT NULL,
    "fecha" TIMESTAMP(6) NOT NULL,
    "nombre_plan" VARCHAR(100),
    "sem_plan" VARCHAR(10) NOT NULL,
    "ranking" INTEGER NOT NULL,

    CONSTRAINT "planificacion_pkey" PRIMARY KEY ("rut_alumno","fecha")
);

-- CreateTable
CREATE TABLE "planificacion_ramo" (
    "rut_alumno" VARCHAR(12) NOT NULL,
    "fecha_plan" TIMESTAMP(6) NOT NULL,
    "codigo_ramo" VARCHAR(10) NOT NULL,
    "sem_asignado" VARCHAR(10) NOT NULL,
    "estado" VARCHAR(20),

    CONSTRAINT "planificacion_ramo_pkey" PRIMARY KEY ("rut_alumno","fecha_plan","codigo_ramo","sem_asignado")
);

-- CreateTable
CREATE TABLE "prerequisitos" (
    "codigo_ramo" VARCHAR(10) NOT NULL,
    "codigo_preramo" VARCHAR(10) NOT NULL,

    CONSTRAINT "prerequisitos_pkey" PRIMARY KEY ("codigo_ramo","codigo_preramo")
);

-- CreateTable
CREATE TABLE "ramo" (
    "codigo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "creditos" INTEGER NOT NULL,
    "nivel" VARCHAR(10),

    CONSTRAINT "ramo_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "ramos_syllabus" (
    "codigo_ramo" VARCHAR(10) NOT NULL,
    "codigo_syll" VARCHAR(10) NOT NULL,
    "catalogo" VARCHAR(10) NOT NULL,

    CONSTRAINT "ramos_syllabus_pkey" PRIMARY KEY ("codigo_ramo","codigo_syll","catalogo")
);

-- CreateTable
CREATE TABLE "semestre" (
    "id_semestre" VARCHAR(10) NOT NULL,
    "tipo_sem" VARCHAR(20) NOT NULL,

    CONSTRAINT "semestre_pkey" PRIMARY KEY ("id_semestre")
);

-- CreateTable
CREATE TABLE "syllabus" (
    "codigo" VARCHAR(10) NOT NULL,
    "catalogo" VARCHAR(10) NOT NULL,

    CONSTRAINT "syllabus_pkey" PRIMARY KEY ("codigo","catalogo")
);

-- CreateTable
CREATE TABLE "usuario" (
    "rut" VARCHAR(12) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "rol" VARCHAR(50) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("rut")
);

-- AddForeignKey
ALTER TABLE "alumno_carrera" ADD CONSTRAINT "alumno_carrera_codigo_carrera_catalogo_fkey" FOREIGN KEY ("codigo_carrera", "catalogo") REFERENCES "carrera"("codigo", "catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_carrera" ADD CONSTRAINT "alumno_carrera_rut_alumno_fkey" FOREIGN KEY ("rut_alumno") REFERENCES "usuario"("rut") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_rut_usuario_fkey" FOREIGN KEY ("rut_usuario") REFERENCES "usuario"("rut") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_academico" ADD CONSTRAINT "historial_academico_codigo_ramo_fkey" FOREIGN KEY ("codigo_ramo") REFERENCES "ramo"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_academico" ADD CONSTRAINT "historial_academico_rut_alumno_fkey" FOREIGN KEY ("rut_alumno") REFERENCES "usuario"("rut") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_academico" ADD CONSTRAINT "historial_academico_sem_cursado_fkey" FOREIGN KEY ("sem_cursado") REFERENCES "semestre"("id_semestre") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planificacion" ADD CONSTRAINT "fk_planificacion_semestre" FOREIGN KEY ("sem_plan") REFERENCES "semestre"("id_semestre") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planificacion" ADD CONSTRAINT "planificacion_rut_alumno_fkey" FOREIGN KEY ("rut_alumno") REFERENCES "usuario"("rut") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planificacion_ramo" ADD CONSTRAINT "planificacion_ramo_rut_alumno_fecha_plan_fkey" FOREIGN KEY ("rut_alumno", "fecha_plan") REFERENCES "planificacion"("rut_alumno", "fecha") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificacion_ramo" ADD CONSTRAINT "planificacion_ramo_codigo_ramo_fkey" FOREIGN KEY ("codigo_ramo") REFERENCES "ramo"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planificacion_ramo" ADD CONSTRAINT "planificacion_ramo_sem_asignado_fkey" FOREIGN KEY ("sem_asignado") REFERENCES "semestre"("id_semestre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisitos" ADD CONSTRAINT "prerequisitos_codigo_preramo_fkey" FOREIGN KEY ("codigo_preramo") REFERENCES "ramo"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prerequisitos" ADD CONSTRAINT "prerequisitos_codigo_ramo_fkey" FOREIGN KEY ("codigo_ramo") REFERENCES "ramo"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ramos_syllabus" ADD CONSTRAINT "ramos_syllabus_codigo_ramo_fkey" FOREIGN KEY ("codigo_ramo") REFERENCES "ramo"("codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ramos_syllabus" ADD CONSTRAINT "ramos_syllabus_codigo_syll_catalogo_fkey" FOREIGN KEY ("codigo_syll", "catalogo") REFERENCES "carrera"("codigo", "catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "syllabus" ADD CONSTRAINT "syllabus_codigo_catalogo_fkey" FOREIGN KEY ("codigo", "catalogo") REFERENCES "carrera"("codigo", "catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;
