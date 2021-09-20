const {PrismaClient} = require('@prisma/client');

(async () => {

  const prisma = new PrismaClient();

  const res = await prisma.kota.findMany({})
  console.log(res)


})();
