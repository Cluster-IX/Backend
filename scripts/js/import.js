const { readFile, writeFile } = require("fs/promises");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();

(async (type) => {
  if (type == "soal") await importSoal();
  else if (type == "kota") await importKota();
  else if (type == "mapel") await importMapel();
  else if (type == "siswa") await importSiswa();
})(process.argv[2]);

async function importKota() {
  const raw = await readFile(path.resolve(__dirname, "../../data/kota.csv"), {
    encoding: "utf8",
  });

  // const kotas = await readFile(path.resolve(__dirname, "../../data/kota.csv"), {
  //   encoding: "utf8",
  // }).then((data) => data.split(/\r?\n/));
  // kotas.pop();

  // await prisma.kota.create()
}

async function importSoal() {
  const soals = await readFile(path.resolve(__dirname, "../../data/soal.csv"), {
    encoding: "utf8",
  }).then((data) => data.split(/\r?\n/));

  console.log(soals);
}
