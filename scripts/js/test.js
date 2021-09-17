const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  let res = await prisma.soal.findMany({
    select: {
      id: true,
      id_mapel: true,
      jawaban_benar: true,
    },
  });

  let asd = res.map(item => item.jawaban_benar )

  console.log(asd)
})();
