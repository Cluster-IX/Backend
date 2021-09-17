const { readFile, writeFile } = require("fs/promises");

const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async (initVal = 1) => {
  const maxSiswa = 10 * 1000 * 1000;
  const init = initVal * maxSiswa;

  const maxMapel = 7;
  const maxSoalMapel = 40;
  const maxSoal = maxMapel * maxSoalMapel;

  const choices = ["a", "b", "c", "d"];

  let tempData = [];

  for (let idSiswa = startVal; idSiswa <= endVal; idSiswa++) {
    let data = [];
    for (let idSoal = 1; idSoal <= maxSoal; idSoal++) {
      let jawaban = choices[random(0, 3)];

      let { jawaban_benar } = await prisma.soal.findUnique({
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

    tempData.push(data);
    // console.log(tempData.flat())
    // return

    console.log(tempData.length);
    if (tempData.length == 10) {
      await prisma.result
        .createMany({ data: [...tempData.flat()] })
        // .catch(() => console.log("error: ", idSiswa));
        .catch((e) => console.log(e));
      tempData = [];
    }
  }
})(process.argv[2]);

function random(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
