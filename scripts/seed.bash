#!/bin/env bash

# Kota
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/csv/kota.csv' 
  INTO TABLE Kota  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Mapel
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/csv/mapel.csv' 
  INTO TABLE Mata_Pelajaran  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Siswa
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/csv/siswa.csv' 
  INTO TABLE Siswa  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"

# Soal
docker exec -i db_container \
  mysql -uroot -pverysecret --local-infile CBT_JATIM -e \
  "LOAD DATA LOCAL INFILE '/data/csv/soal.csv' 
  INTO TABLE Soal  
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '\"' 
  LINES TERMINATED BY '\n'"
