const { readFile, writeFile } = require("fs/promises");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();

(async () => {
  const filepath = path.resolve(__dirname, "../../data/output/siswa.csv");
  const raw = await readFile(filepath, { encoding: "utf8" });
  const records = raw.split(/\r|\n/);

  // console.log(records.length)
  let tempData = [];
  for (let record of records) {
    const parsed = record.split(",");

    tempData.push({
      nrp: parsed[1],
      nama: parsed[2],
    });

    if(tempData.length == 1000){
      await prisma.siswa.createMany({data: tempData})
      tempData = []
    }

    await setTimeout(() => {}, 1000)
  }
})();
