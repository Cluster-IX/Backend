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
  let siswaResult, mapelResult, serialized;

  const pad = (id) => id.padStart(3, "0").slice(-2);

  const where = {
    siswa: {
      nrp: id_kota ? { startsWith: pad(id_kota) } : nrp || undefined,
      nama: nama ? { contains: nama } : undefined,
    },
    id_siswa: Number(id_siswa) || undefined,
    // id_mapel: Number(id_mapel) || undefined,
    // skor: Number(skor) || undefined
  };

  const orderBy = {
    [sortField]: sortOrder,
  };

  const query = {
    take: Number(count),
    skip: Number((page - 1) * count),
    orderBy: orderBy,
    where: where,
    select: {
      id: true,
      siswa: { select: { nama: true, nrp: true } },
      // skor: true,
      // id_mapel: true,
    },
  };

  console.log("---");
  console.time("Query");
  siswaResult = await prisma.siswa.findMany(query);
  mapelResult = await prisma.mata_Pelajaran.findMany({where: {id_mapel: id_mapel || undefined}});
  console.timeEnd("Query");


  console.log(mapelResult)
  res.send("halo")
  return
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

  res.send(serialized);
});

router.get("/count", async (req, res) => {
  const {
    id_mapel,
    id_kota,
    id_siswa,
    nama,
    nrp,
    skor,
  } = req.query;

  const pad = (id) => id.padStart(3, "0").slice(-2);

  const where = {
    siswa: {
      nrp: id_kota ? { startsWith: pad(id_kota) } : nrp || undefined,
      nama: nama ? { contains: nama } : undefined,
    },
    id_mapel: Number(id_mapel) || undefined,
    id_siswa: Number(id_siswa) || undefined,
    skor: Number(skor) || undefined
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
