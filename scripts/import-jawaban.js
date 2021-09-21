const { readFile, writeFile } = require("fs/promises");

const path = require("path");
const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();
  let rawAnswer = await prisma.soal.findMany({
    select: {
      id: true,
      jawaban_benar: true,
    },
  });

  let answers = rawAnswer.map((item) => item.jawaban_benar);

  let maxSiswa = 500 * 1000;
  // maxSiswa = 1

  const maxMapel = 7;
  const maxSoalMapel = 40;
  const maxSoal = maxMapel * maxSoalMapel;

  const choices = ["a", "b", "c", "d"];

  let tempData = [];

  for (let idSiswa = 1; idSiswa <= maxSiswa; idSiswa++) {
    let data = [];
    for (let idSoal = 1; idSoal <= maxSoal; idSoal++) {
      let jawaban = choices[random(0, 3)];

      data.push({
        id_siswa: idSiswa,
        id_soal: idSoal,
        value: jawaban,
      });

      // data.push({
      //   id_siswa: idSiswa,
      //   id_soal: idSoal,
      //   jawaban,
      //   // is_jawaban_benar: jawaban == answers[idSoal],
      // });
    }

    tempData.push(data);

    if (tempData.length == 50) {
      // console.log(tempData.flat())

      await prisma.jawaban
        .createMany({ data: [...tempData.flat()] })
        .catch((e) => console.log(e));
      tempData = [];
    }
  }
})();

function random(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
