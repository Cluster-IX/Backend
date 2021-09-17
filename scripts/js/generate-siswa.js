const {readFile, writeFile} = require('fs/promises')
const path = require('path')

;(async () => {
  const namePath = path.resolve(__dirname, "../../data/raw/generated-name.txt")
  const destinationPath = path.resolve(__dirname, "../../data/output/siswa.csv")
  const rawName = await readFile(namePath, {encoding: "utf8"})
  const names = rawName.split(/\r|\n/)
  names.pop()
  const result = []

  const maxStud = 500 * 1000;
  const maxStart = 38;
  const nStud = Math.ceil(maxStud / maxStart);

  let counter = 0;
  for (let start = 1; start <= maxStart; start++) {
    for (let end = 1; end <= nStud; end++) {
      const nrp_awal = `${start}`.padStart(2, "0");
      const nrp_akhir = `${end}`.padStart(12, "0");
      const nrp = `${nrp_awal}${nrp_akhir}`;
      // const record = `"${counter + 1}","${nrp}","${arr_nama[counter]}"\n`;
      const record = `,${nrp},${names[counter]}`;
      if (counter < maxStud) {
        result.push(record)
        // FILESTRING += record;
        counter++;
      }
    }
  }

  await writeFile(destinationPath, result.join(`\n`), { encoing: "utf8" });
})();
