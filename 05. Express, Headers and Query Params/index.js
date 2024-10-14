const express = require("express");
const app = express();

app.use(express.json());

let cntReqs = 0;

function displayDetails(req, res, next) {
  const method = req.method;
  //   const url = req.url;
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(fullUrl);

  let timeStamp = new Date();
  timeStamp = timeStamp.toLocaleString();

  console.log(`Method: ${method}`);
  console.log(`URL: ${fullUrl}`);
  console.log(`TimeStamp of Request: ${timeStamp}`);

  next();
}

function countServerCalls(req, res, next) {
  cntReqs++;
  next();
}

app.get("/", displayDetails, countServerCalls, function (req, res) {
  return res.status(200).json({
    message: "GET request successfully called",
    success: true,
  });
});

app.delete("/", displayDetails, countServerCalls, function (req, res) {
  return res.status(200).json({
    message: "DELETE request successfully called",
    success: true,
  });
});

app.post("/", displayDetails, countServerCalls, function (req, res) {
  return res.status(200).json({
    message: "POST request successfully called",
    success: true,
  });
});

app.put("/", displayDetails, countServerCalls, function (req, res) {
  return res.status(200).json({
    message: "PUT/PATCH request successfully called",
    success: true,
  });
});

app.get("/count-server-calls", function (req, res) {
  return res.status(200).json({
    numberOfRequests: cntReqs,
    message: "All the Requests made till now counted successfully!!!",
    success: true,
  });
});

app.listen(3000, () => {
  console.log(`App is listening at PORT 3000!!!`);
});
