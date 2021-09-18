const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  //const maxSiswa = 500 * 1000;
  const maxSiswa = 10;

  const idSiswa = 1;

  const nilai = await prisma.$queryRawUnsafe("SELECT * FROM Jawaban WHERE id_siswa = 1")
  console.log(nilai);

  //   for (let idSiswa = 1; idSiswa <= maxSiswa; idSiswa++) {
  // //     const x = await prisma.siswa.count({
  // //       where: {
  // //         id: idSiswa,
  // //       },
  // //     });

  // //     console.log(x)

  //     const nilai = await prisma.jawaban.count({
  //       where: {
  //         id_siswa: idSiswa,
  //         AND: {
  //           is_jawaban_benar: true
  //         }
  //       }
  //     })

  //     console.log(nilai);
  //   }
})();
