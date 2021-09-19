const express = require("express");
const router = express.Router();

// const prisma = require('../lib/prisma')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let totalResult = 0;

router.get("/", async (req, res) => {
  const { page = 1, count = 20, id_mapel, id_siswa, nama } = req.query;

  let siswaQuery, serialized, total;

  if (nama) {
    const query = `SELECT Result.id as id, Siswa.nrp as nrp, Siswa.nama as nama, Result.id_mapel as id_mapel, Result.skor as skor
      FROM Result
      INNER JOIN Siswa ON Result.id_siswa=Siswa.id
      INNER JOIN Mata_Pelajaran ON Result.id_mapel=Mata_Pelajaran.id
      WHERE Siswa.nama LIKE "%${nama}%"
      ${id_mapel && id_mapel != 0 ? "AND id_mapel = " + id_mapel : ""}
      LIMIT ${count}
      OFFSET ${(page - 1) * count}`;

    //TODO: count
    // if (!totalResult) {
    //   totalResult = await prisma.result.count();
    // }

    siswaQuery = await prisma.$queryRawUnsafe(query);
    serialized = {
      total: totalResult,
      data: siswaQuery,
    };

  } else {
    const where = {};

    if (id_mapel && id_mapel != 0) where.id_mapel = Number(id_mapel);
    if (id_siswa) where.id_siswa = Number(id_siswa);

    siswaQuery = await prisma.result.findMany({
      take: Number(count),
      skip: Number((page - 1) * count),
      where,
      select: {
        id: true,
        skor: true,
        siswa: { select: { nama: true, nrp: true } },
        id_mapel: true,
      },
    });

    // totalResult = await prisma.result.count();
    if (!totalResult) {
      totalResult = await prisma.result.count();
    }

    serialized = {
      total: totalResult,
      data: siswaQuery.map(
        ({ id, siswa: { nama: namaSiswa, nrp }, id_mapel, skor }) => ({
          id,
          nrp,
          nama: namaSiswa,
          id_mapel,
          skor,
        })
      ),
    };
  }

  res.send(serialized);
});

module.exports = router;
