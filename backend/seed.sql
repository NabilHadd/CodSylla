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


