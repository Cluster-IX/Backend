const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();

  const page = 1,
    count = 10;

  const nrp = "01000000000010";
  // const nrp = undefined
  let id_mapel = undefined;
  let id_siswa = undefined;
  let id_kota = "2"

  let padded_id_kota = id_kota.padStart(3,"0").slice(-2)
  id_kota = undefined


  const where = {
    siswa: {
      nrp: id_kota ? {startsWith: padded_id_kota} : nrp || undefined,
    },
    id_mapel: Number(id_mapel) || undefined,
    id_siswa: Number(id_siswa) || undefined,
  };

  const orderBy = [

  ]

  // console.log(where)
  // return

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

  const res = await prisma.result.findMany(query);

  console.log(res);
})();
// where: {
//   siswa: {
//     is: {
//       nrp: {
//         startsWith: "02"
//       }
//     }
//   },
// },
