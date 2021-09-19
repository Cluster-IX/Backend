const express = require("express");
const router = express.Router();

// const prisma = require('../lib/prisma')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const { page = 1, count = 10, id_mapel, id_siswa, nama } = req.query;

  const where = {};

  if (id_mapel && id_mapel != 0) where.id_mapel = Number(id_mapel);
  if (id_siswa) where.id_siswa = Number(id_siswa);

  let siswaQuery;
  let serialized;
  if (nama) {
    const query = `SELECT Result.id as id, Siswa.nama as nama, Result.id_mapel as id_mapel, Result.skor as skor
      FROM Result
      INNER JOIN Siswa ON Result.id_siswa=Siswa.id
      INNER JOIN Mata_Pelajaran ON Result.id_mapel=Mata_Pelajaran.id
      WHERE Siswa.nama LIKE "%${nama}%"
      ${id_mapel ? " AND id_mapel = " + id_mapel : ""}
      LIMIT ${count}
      OFFSET ${(page - 1) * 10}`;

    siswaQuery = await prisma.$queryRawUnsafe(query);
    serialized = siswaQuery;
  } else {
    siswaQuery = await prisma.result.findMany({
      take: Number(count),
      skip: Number((page - 1) * count),
      where,
      select: {
        id: true,
        skor: true,
        siswa: { select: { nama: true } },
        id_mapel: true,
        // mapel: { select: { nama: true } },
      },
    });

    serialized = siswaQuery.map(
      ({ id, siswa: { nama: namaSiswa }, id_mapel, skor }) => ({
        id,
        nama: namaSiswa,
        id_mapel,
        skor,
      })
    );
  }

  // const serialized = siswaQuery.map(
  //   ({ id, siswa: { nama: namaSiswa }, mapel: { nama: namaMapel }, skor }) => ({
  //     id,
  //     nama: namaSiswa,
  //     // mapel: namaMapel,
  //     skor,
  //   })
  // );

  res.send(serialized);
});

router.get("/raw", async (req, res) => {
  const { name, page = 1, count = 10 } = req.query;

  const queryString = `SELECT * FROM Siswa WHERE nama LIKE "%${name}%" LIMIT ${count} OFFSET ${
    (page - 1) * count
  }`;

  const result = await prisma.$queryRawUnsafe(queryString);

  res.send({ result });
});

module.exports = router;
