const { readFile, writeFile } = require("fs/promises");
const util = require('util')
const exec = util.promisify(require('child_process').exec);

(async () => {
  const { stdout, stderr } = await exec('ls');

  if (stderr) {
    console.error(`error: ${stderr}`);
  }

  console.log(`Number of files ${stdout}`);
})();
