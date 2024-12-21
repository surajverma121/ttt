const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(" welcome  to suraj  ");
});

app.get("/home", (req, res) => {
    res.status(200).json(" welcome  to home  ");
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports =app;