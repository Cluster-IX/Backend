const express = require("express");
const router = express.Router();
// const prisma = require('../lib/prisma')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const { page = 1, count = 10 } = req.query;

  const siswa = await prisma.siswa.findMany({
    take: Number(count),
    skip: (Number(page) - 1) * 10,
  });

  res.send({ data: siswa });
});

router.get("/raw", async (req, res) => {
  const { name, page = 1, count = 10 } = req.query;

  const queryString = `SELECT * FROM Siswa WHERE nama LIKE "%${name}%" LIMIT ${count} OFFSET ${(page-1)*count}`

  const result = await prisma.$queryRawUnsafe(queryString)

  res.send({result});
});
module.exports = router;
