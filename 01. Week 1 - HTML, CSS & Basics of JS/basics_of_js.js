function findVoters(arr) {
  let voters = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].age >= 18 && arr[i].gender === "male") voters.push(arr[i].name);
  }

  return voters;
}

const arr = [
  {
    name: "Arghya",
    age: 22,
    gender: "male",
  },
  {
    name: "Debasmita",
    age: 22,
    gender: "female",
  },
  {
    name: "Raj",
    age: 52,
    gender: "male",
  },
  {
    name: "Apratim",
    age: 15,
    gender: "male",
  },
];

const ans = findVoters(arr);

for (let i = 0; i < ans.length; i++) {
  console.log(ans[i]);
}
