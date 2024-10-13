// function sum(a, b) {
//   return a + b;
// }

// function sumTillN(n) {
//   let sum = 0;

//   for (let i = 0; i <= n; i++) {
//     sum += i;
//   }

//   return sum;
// }

// // let ans = sum(2, 3);

// let ans = sumTillN(100);
// // console.log(ans);

// const fs = require("fs");

// let a = fs.readFileSync("./a.txt", "utf-8");
// console.log(a);

// function random() {}

// let p = new Promise(random);
// console.log(p);

// Creating a promisified version of fs.readFile asynchronously
// Promises take a function and on the eventual completion calls resolve parameter or reject parameter in case of failure

// const fs = require("fs");

// function promiseCallBack(resolve, reject) {}

// function cleanFile(fileName) {
//   return new Promise(function (resolve, reject) {
//     let contents = fs.readFile(fileName, "utf-8", function (err, data) {
//       resolve(data);
//     });
//   });
// }

// function callBack(contents) {
//   console.log(contents);
// }

// cleanFile("./a.txt").then(callBack);

// Creating a promisifed setTimeOut function

function promisifedSetTimeOut(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}

function callBack() {
  console.log(`SetTimeOut is called from a promisifed function!!!`);
}

// promisifedSetTimeOut(5000).then(callBack);

// promisifedSetTimeOut(1000)
//   .then(function () {
//     console.log("Hi");
//     return promisifedSetTimeOut(3000);
//   })
//   .then(function () {
//     console.log("Hello");
//     return promisifedSetTimeOut(5000);
//   })
//   .then(function () {
//     console.log("Hi There!!!");
//   });

// promisifedSetTimeOut(3000).then(function () {
//   console.log("Hello");
// });

// promisifedSetTimeOut(5000).then(function () {
//   console.log("Hi there");
// });

const fs = require("fs");

function promisifiedReadFile(fileName) {
  return new Promise(function (resolve, reject) {
    let contents = fs.readFile(fileName, "utf-8", function (err, data) {
      resolve(data);
    });
  });
}

async function solve() {
  const res = await promisifiedReadFile("./a.txt");
  console.log(res);
}

solve();
