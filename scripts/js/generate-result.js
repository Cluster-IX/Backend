const { readFile, writeFile } = require("fs/promises");

const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async (initVal = 1) => {
  const maxSiswa = 10 * 1000 * 1000;
  const init = initVal * maxSiswa

  const maxMapel = 7;
  const maxSoalMapel = 40;
  const maxSoal = maxMapel * maxSoalMapel;

  const choices = ["a", "b", "c", "d"];

  // const startVal = initVal * (init - maxSiswa) + 1
  // const endVal = startVal + maxSiswa - 1
  const endVal = initVal * maxSiswa
  const startVal = endVal - maxSiswa + 1

  // console.log(startVal, endVal)
  // return
  for (let idSiswa = startVal; idSiswa <= endVal; idSiswa++) {
    let data = [];
    for (let idSoal = 1; idSoal <= maxSoal; idSoal++) {
      let jawaban = choices[random(0, 3)];


      let {jawaban_benar} = await prisma.soal.findUnique({
        where: {
          id: idSoal,
        },
        select: {
          jawaban_benar: true,
        },
      });

      data.push({
        id_siswa: idSiswa,
        id_soal: idSoal,
        jawaban,
        is_jawaban_benar: jawaban == jawaban_benar,
      });
    }

    await prisma.result.createMany({data})
  }
})(process.argv[2]);

function random(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
