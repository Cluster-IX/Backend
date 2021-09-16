const { readFile, writeFile } = require("fs/promises");
const path = require("path");

(async () => {
  let FILESTRING = "";
  const maxMapel = 7;
  const maxSoalMapel = 40;
  const maxSoal = maxMapel * maxSoalMapel;

  const choices = ["a", "b", "c", "d"];

  let currentNumber = 1;
  let currentIdMapel = 1;

  for (let idMapel = 1; idMapel <= maxMapel; idMapel++) {
    for (let idSoal = 1; idSoal <= maxSoalMapel; idSoal++) {
      let soal = `soal number ${idSoal} mapel ${idMapel}`;
      let choice = choices.map(
        (item) =>
          `choice ${item} number ${idSoal} matkul ${idMapel}`
      );
      let mergeChoice = choice.join(",");

      const randomChoice = choices[random(0, 3)];
      FILESTRING += `,${idMapel},${randomChoice},${soal},${mergeChoice}\n`;
    }
  }

  await writeFile(path.resolve(__dirname, "../../data/soal.csv"), FILESTRING, {
    encoding: "utf-8",
  });
})();

function random(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}

//   for (let i = 1; i <= 100; i++) {
//     let soal = `soal number ${currentNumber} mapel ${currentIdMapel}`
//     let choice = choices.map(item => `choice ${item} number ${currentNumber} matkul ${currentIdMapel}`)
//     let mergeChoice = choice.join(",")

//     currentNumber++
//     currentIdMapel++

//     if(currentNumber > maxSoalMapel) currentNumber = 1
//     if(currentIdMapel > maxMapel) currentIdMapel = 1

//     const randomChoice = choices[random(0, 3)];
//     FILESTRING+=`,${currentIdMapel},${randomChoice},${soal},${mergeChoice}\n`
//   }
