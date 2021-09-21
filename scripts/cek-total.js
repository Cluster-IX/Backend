// Monitoring script to count table count

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  const diffs = [];

  let last;

  setInterval(async () => {
    const table = "jawaban";
    const sum = await prisma[table].count().catch(e => last);
    const max = 500 * 1000 * 280

    if (!last) {
      last = Number(sum)
    } else {
      diffs.push(Number(sum) - last);
      last = Number(sum)
    }

    const avg = diffs.reduce((a,b) => a+b, 0) / diffs.length
    const estimated = (max - sum) / avg
    console.log(`Estimated time: ${Math.floor(estimated/60)} minutes`)

    console.log(
      `${sum.toLocaleString()}/${max.toLocaleString()}`
    );
  }, 1000);
})();
