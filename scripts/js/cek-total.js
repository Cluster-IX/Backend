const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient();

(async () => {
  setInterval(async () => {
    const table = "result"
    const sum = await prisma[table].count()
    console.log(`${sum.toLocaleString()}/${((500 * 1000 * 280).toLocaleString())}`)
  }, 1000)
})();
