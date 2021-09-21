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


  const pad = (id) => id.padStart(3, "0").slice(-2);

  const where = {
    siswa: {
      nrp: id_kota ? { startsWith: pad(id_kota) } : nrp || undefined,
      nama: nama ? { contains: nama } : undefined,
    },
    id_mapel: Number(id_mapel) || undefined,
    id_siswa: Number(id_siswa) || undefined,
  };

  const query = {
    take: Number(count),
    skip: Number((page - 1) * count),
    where: where,
    select: {
      id: true,
      skor: true,
      siswa: { select: { nama: true, nrp: true } },
      id_mapel: true,
    },
  };

  console.log("---")
  // console.log({ id_mapel, id_kota, id_siswa, nama, nrp });
  console.time("Query");
  siswaResult = prisma.result.findMany(query);
  totalResult = prisma.result.count({
    ...query,
    select: undefined,
    take: undefined,
    skip: undefined,
  });

  // [siswaResult, totalResult] = await Promise.all([siswaResult, totalResult])
  [siswaResult] = await Promise.all([siswaResult])
  console.timeEnd("Query");

  //   console.time("Query");
  //   siswaResult = await prisma.result.findMany(query);
  //   console.timeEnd("Query");

  //   console.time("Count");
  //   totalResult = await prisma.result.count({
  //     ...query,
  //     select: undefined,
  //     take: undefined,
  //     skip: undefined,
  //   });
  //   console.timeEnd("Count");

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

module.exports = router;
