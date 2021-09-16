# Import kota
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/kota.csv' 
  INTO TABLE Kota  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Import mapel
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/mapel.csv' 
  INTO TABLE Mata_Pelajaran  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Import siswa
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/siswa.csv' 
  INTO TABLE Siswa  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Import soal
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/soal.csv' 
  INTO TABLE Soal  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Truncate siswa
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE Siswa;
  SET FOREIGN_KEY_CHECKS = 1;"

docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE Result;
  SET FOREIGN_KEY_CHECKS = 1;"
