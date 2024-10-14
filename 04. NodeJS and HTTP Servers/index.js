function countWords(fileName) {
  fs.readFile(fileName, "utf-8", (error, data) => {
    if (error) {
      console.log("Error:" + error);
      return;
    }

    data += " ";
    let cntWords = 0;
    let eachWord = "";

    for (let i = 0; i < data.length; i++) {
      //   console.log(data[i]);

      if (data[i] === " ") {
        cntWords += eachWord.length > 0 ? 1 : 0;
        eachWord = "";
      } else {
        eachWord += data[i];
      }
    }
    console.log(cntWords);

    return cntWords;
  });
}

const fs = require("fs");
const { Command } = require("commander");
const program = new Command();

program
  .name("counter")
  .description("CLI to do file based tasks")
  .version("0.8.0");

program
  .command("count")
  .description("Count the number of lines in a file")
  .argument("<file>", "file to count")
  .action((file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      data += " ";
      let cntWords = 0;
      let eachWord = "";

      for (let i = 0; i < data.length; i++) {
        //   console.log(data[i]);

        if (data[i] === " ") {
          cntWords += eachWord.length > 0 ? 1 : 0;
          eachWord = "";
        } else {
          eachWord += data[i];
        }
      }
      console.log(`There are ${cntWords} words in the given ${file}!`);
    });
  });

program.parse();

// (async () => {
//   const ans = await countWords("./a.txt");
//   console.log(ans);
// })();
