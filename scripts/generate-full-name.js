// Combine single name into fullname (first, middle, last name) 

const { readFile, writeFile } = require("fs/promises");
const path = require("path");

(async () => {
  const singleNamePath = path.resolve(__dirname, "./single-name.txt");
  const raw = await readFile(singleNamePath, { encoding: "utf-8" });
  const single_names = raw.split("\n");
  single_names.pop();

  // console.log(setOfName.size)

  let results = [];

  for (let i = 0; i < single_names.length - 2; i++) {
    for (let j = i + 1; j < single_names.length - 1; j++) {
      for (let k = j + 1; k < single_names.length; k++){
        results.push(`${single_names[i]} ${single_names[j]} ${single_names[k]}`);
      }
    }
  }

  await writeFile("generated-name-full.txt", results.join(`\n`), {encoding: "utf-8"})
})();

function random(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}
