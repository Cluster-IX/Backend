-- Belom jadi, mungking gak dipake

DELIMITER //

CREATE TRIGGER check_correct_jawaban
BEFORE INSERT
   ON Result FOR EACH ROW

BEGIN

  --set NEW.jawaban_benar

   DECLARE vUser varchar(50);

   -- Find username of person performing INSERT into table
   SELECT USER() INTO vUser;

   -- Update create_date field to current system date
   SET NEW.created_date = SYSDATE();

   -- Update created_by field to the username of the person performing the INSERT
   SET NEW.created_by = vUser;

END; //

DELIMITER ;
