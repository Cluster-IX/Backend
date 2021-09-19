const { PrismaClient } = require("@prisma/client");
const deleteBeforeImport = true;

(async () => {
  const prisma = new PrismaClient();

  const maxSiswa = 500 * 1000;
  const maxMapel = 7;

  const minSkor = 10;
  const maxSkor = 40;

  let batchData = [];

  if (deleteBeforeImport) {
    console.log("deleting result data..");
    // await prisma.result.deleteMany({});
    await prisma.$executeRawUnsafe('TRUNCATE Result')
    console.log("data deleted.");
  }

  let counter = 1;
  for (let idSiswa = 1; idSiswa <= maxSiswa; idSiswa++) {
    let data = [];
    for (let idMapel = 1; idMapel <= maxMapel; idMapel++) {
      const randomSkor = random(minSkor, maxSkor);
      data.push({
        id_siswa: idSiswa,
        id_mapel: idMapel,
        skor: randomSkor,
      });
    }

    batchData.push(data);

    if (batchData.length == 1000) {
      console.log(counter++, "/", maxSiswa / 1000);
      await prisma.result
        .createMany({ data: [...batchData.flat()] })
        .catch((e) => console.log(e));
      batchData = [];
    }
  }
})();

function random(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
