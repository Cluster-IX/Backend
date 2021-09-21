const express = require("express");
const router = express.Router();

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

  let siswaResult, serialized;

  if (nama || id_kota) {
    console.log("query 1")

    const query = {}

    query.data = `SELECT Result.id as id, Siswa.nrp as nrp, Siswa.nama as nama, Result.id_mapel as id_mapel, Result.skor as skor
    FROM Result
    INNER JOIN Siswa ON Result.id_siswa=Siswa.id
    INNER JOIN Mata_Pelajaran ON Result.id_mapel=Mata_Pelajaran.id
    WHERE 1
    ${nama ? "AND Siswa.nama LIKE '%" +nama+"%'" : ""}
    ${id_kota && id_kota != 0 ? "AND nrp LIKE '" + id_kota.padStart(3, "0").slice(-2) + "%'" : ""}
    ${id_mapel && id_mapel != 0 ? "AND id_mapel = " + id_mapel : ""}
    LIMIT ${count} 
    OFFSET ${(page - 1) * count}
      `;

    query.count = `SELECT COUNT(Result.id) 
    FROM Result 
    INNER JOIN Siswa ON Result.id_siswa=Siswa.id
    INNER JOIN Mata_Pelajaran ON Result.id_mapel=Mata_Pelajaran.id
    WHERE 1
    ${nama ? "AND Siswa.nama LIKE '%" +nama+"%'" : ""}
    ${id_kota && id_kota != 0 ? "AND nrp LIKE '" + id_kota.padStart(3, "0").slice(-2) + "%'" : ""}
    ${id_mapel && id_mapel != 0 ? "AND id_mapel = " + id_mapel : ""}
      `;

    console.log(query)

    siswaResult = await prisma.$queryRawUnsafe(query.data);
    totalResult = await prisma.$queryRawUnsafe(query.count);
    totalResult = totalResult[0]['COUNT(Result.id)']

    serialized = {
      total: totalResult,
      data: siswaResult,
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

    siswaResult = await prisma.result.findMany(query);
    // totalResult = await prisma.result.count({...query});

    console.log(totalResult)

    serialized = {
      total: totalResult,
      data: siswaResult.map(
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
