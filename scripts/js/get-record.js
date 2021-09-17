const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
(async () => {
  const data = await prisma.siswa.findFirst({
    where: { id: 500000 },
  });

  console.log(data);
})();
