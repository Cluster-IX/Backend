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
    skor,
    sortField,
    sortOrder,
  } = req.query;
  let siswaResult, serialized;

  const pad = (id) => id.padStart(3, "0").slice(-2);

  console.log("---");
  // console.log({ id_mapel, id_kota, id_siswa, nama, nrp });
  console.time("Query");
  // siswaResult = await prisma.

  siswaResult = await prisma.$queryRawUnsafe(`\
    SELECT Siswa.id, Siswa.nrp, Siswa.nama,t0.skor
    FROM Siswa
    INNER JOIN
    (
      SELECT t1.id_siswa, COUNT(*) as skor
      FROM Jawaban t1
      WHERE t1.value = (
        SELECT t2.jawaban_benar
        FROM Soal t2
        WHERE t2.id = t1.id_soal
      )
      GROUP BY t1.id_siswa
      LIMIT ${count}
      OFFSET ${(page - 1) * count}
    ) t0

    ON Siswa.id = t0.id_siswa
    `);

  console.timeEnd("Query");

  serialized = {
    total: totalResult,
    data: siswaResult.map(({ id, nama: namaSiswa, nrp, skor }) => ({
      id,
      nrp,
      skor,
      nama: namaSiswa,
    })),
  };

  res.send(serialized);
});

router.get("/count", async (req, res) => {
  const { id_mapel, id_kota, id_siswa, nama, nrp, skor } = req.query;

  const pad = (id) => id.padStart(3, "0").slice(-2);

  const where = {
    siswa: {
      nrp: id_kota ? { startsWith: pad(id_kota) } : nrp || undefined,
      nama: nama ? { contains: nama } : undefined,
    },
    id_mapel: Number(id_mapel) || undefined,
    id_siswa: Number(id_siswa) || undefined,
    skor: Number(skor) || undefined,
  };

  const query = {
    where: where,
    select: {
      id: true,
    },
  };

  console.log("---");
  console.time("Count");
  totalResult = await prisma.result.count({
    ...query,
    select: undefined,
  });

  console.timeEnd("Count");

  res.send({ totalResult });
});

module.exports = router;
