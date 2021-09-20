const express = require("express");
const router = express.Router();

// const prisma = require('../lib/prisma')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let totalResult = 0;

router.get("/", async (req, res) => {
  const {
    page = 1,
    count = 20,
    id_mapel,
    id_kota,
    id_siswa,
    nama,
    nrp,
  } = req.query;

  let siswaQuery, serialized;

  if (nama || id_kota) {
    console.log("query 1")
    //TODO: add nrp when searching kota
    const query = `SELECT Result.id as id, Siswa.nrp as nrp, Siswa.nama as nama, Result.id_mapel as id_mapel, Result.skor as skor
      FROM Result
      INNER JOIN Siswa ON Result.id_siswa=Siswa.id
      INNER JOIN Mata_Pelajaran ON Result.id_mapel=Mata_Pelajaran.id
      WHERE 1
      ${nama ? "AND Siswa.nama LIKE '%" +nama+"%'" : ""}
      ${id_kota && id_kota != 0 ? "AND nrp LIKE '" + id_kota.padStart(3, "0").slice(-2) + "%'" : ""}
      ${id_mapel && id_mapel != 0 ? "AND id_mapel = " + id_mapel : ""}
      LIMIT ${count}
      OFFSET ${(page - 1) * count}`;

    console.log(query)

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
    console.log("query 2")
    const query = {
      take: Number(count),
      skip: Number((page - 1) * count),
      where: {},
      select: {
        id: true,
        skor: true,
        siswa: { select: { nama: true, nrp: true } },
        id_mapel: true,
      },
    };

    if (id_mapel && id_mapel != 0) query.where.id_mapel = Number(id_mapel);
    if (id_siswa) query.where.id_siswa = Number(id_siswa);
    if (nrp) query.where.siswa = { nrp };

    siswaQuery = await prisma.result.findMany(query);

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
