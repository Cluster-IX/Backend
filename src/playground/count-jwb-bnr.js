const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();

  console.time("get-soal2")
  let kj = await prisma.soal.findMany({
    select: {
      id: true,
      jawaban_benar: true,
    },
  });
  console.timeEnd("get-soal2")

  kj = kj.map((item) => item.jawaban_benar); // 0.0123ms
  // console.log(kj)
  // return

  console.time("get-jwb")
  const jawaban_siswa = await prisma.jawaban.findMany({
    where: {
      id_siswa: 1
    },
    select: {
      id_siswa: true,
      id_soal: true,
      value: true,
      soal: {
        select: {
          jawaban_benar: true,
        }
      }
    },
  });
  console.timeEnd("get-jwb")

  console.time("get-jwb2")
// DONE: ini udah bener
//   const jawaban_siswa2 = await prisma.$queryRawUnsafe(`\
//     SELECT t1.id_siswa, COUNT(*) as Total
//     FROM Jawaban t1
//     WHERE 1
//     AND t1.value = (
//       SELECT t2.jawaban_benar
//       FROM Soal t2
//       WHERE t2.id = t1.id_soal
//     )
//     GROUP BY t1.id_siswa
//     LIMIT 150
//     `);

  const jawaban_siswa2 = await prisma.$queryRawUnsafe(`\
    SELECT Siswa.id, t0.total
    FROM Siswa
    INNER JOIN(
      SELECT t1.id_siswa, COUNT(*) as Total
      FROM Jawaban t1
      WHERE 1
      AND t1.value = (
        SELECT t2.jawaban_benar
        FROM Soal t2
        WHERE t2.id = t1.id_soal
      )
      GROUP BY t1.id_siswa
      -- LIMIT 100 -- ini yang bikin lama
      LIMIT 10
      OFFSET 10
    ) t0
    ON Siswa.id = t0.id_siswa
    `);

  console.timeEnd("get-jwb2")

  // console.log(jawaban_siswa)
  // return
  // console.log(jawaban_siswa.filter(( {id_soal, value} ) => kj[id_soal] == value).length)

  // console.log(jawaban_siswa.filter(( {id_soal, value, soal: {jawaban_benar}} ) => value == jawaban_benar).length)
  // console.log(jawaban_siswa2.length)
  console.log(jawaban_siswa2)
})();

// return jawaban benar also from soal
(async () => {
  const prisma = new PrismaClient();

  console.time("get-soal")
  let kj = await prisma.soal.findMany({
    select: {
      id: true,
      jawaban_benar: true,
    },
  });
  console.timeEnd("get-soal")

  kj = kj.map((item) => item.jawaban_benar); // 0.0123ms

  console.time("get-jwb")
  const jawaban_siswa = await prisma.jawaban.findMany({
    take: 10,
    skip: 0,
    // where: {
    //   soal: {
    //     jawaban_benar: ,
    //   }
    // },
    select: {
      id_siswa: true,
      id_soal: true,
      value: true,
      soal: {
        select: {
          jawaban_benar: true,
        }
      }
    },
  });
  console.timeEnd("get-jwb")

  // console.log(jawaban_siswa)
  return


  const skor = jawaban_siswa.filter(
    ({ id_soal, value }) => value == kj[id_soal]
  );

  console.log(skor.length);
});















// Latihan
(async () => {
  const prisma = new PrismaClient();

  console.time("get-soal")
  let kj = await prisma.soal.findMany({
    select: {
      id: true,
      jawaban_benar: true,
    },
  });
  console.timeEnd("get-soal")

  kj = kj.map((item) => item.jawaban_benar); // 0.0123ms

  console.time("get-jwb")
  const jawaban_siswa = await prisma.jawaban.findMany({
    where: {
      id_siswa: {
        in: [1,2,3]
      },
    },
    select: {
      id_siswa: true,
      id_soal: true,
      value: true,
    },
  });
  console.timeEnd("get-jwb")

  const skor = jawaban_siswa.filter(
    ({ id_soal, value }) => value == kj[id_soal]
  );

  console.log(skor.length);
})
