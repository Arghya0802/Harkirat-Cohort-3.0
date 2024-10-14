const path = require("path");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/sum", function (req, res) {
  const { a, b } = req.body;

  if (!a || !b)
    return res.status(400).json({
      message: "Send both values",
      success: false,
    });

  return res.status(200).json({
    result: parseInt(a) + parseInt(b),
    message: "Two numbers added successfully!!!",
    success: true,
  });
});

app.listen(3000, () => {
  console.log("App is listening at Port 3000!!!");
});
