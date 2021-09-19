const express = require("express");
const router = express.Router();
// const prisma = require('../lib/prisma')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const { page = 1, count = 10, id_mapel, id_siswa } = req.query;

  const where = {}

  if(id_mapel) where.id_mapel = Number(id_mapel)
  if(id_siswa) where.id_siswa = Number(id_siswa)

  const siswaQuery = await prisma.result.findMany({
    take: Number(count),
    skip: Number((page - 1) * count),
    where,
    select: {
      id: true,
      skor: true,
      siswa: { select: { nama: true } },
      mapel: { select: { nama: true } },
    },
  });

  const serialized = siswaQuery.map(
    ({ id, siswa: { nama: namaSiswa }, mapel: { nama: namaMapel }, skor }) => ({
      id,
      nama: namaSiswa,
      mapel: namaMapel,
      skor,
    })
  );

  res.send({ data: serialized });
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
