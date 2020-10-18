const express = require("express");
//const bodyParser = require("body-parser");

const app = express();

//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  let body = "";
  req.on("end", () => {
    const userName = body.split("=")[1];
    if (userName) {
      req.body = { name: userName };
    }
    next();
  });
  req.on("data", (chunk) => {
    body += chunk;
  });
});

app.use((req, res, next) => {
  if (req.body) {
    res.send(`<h1> ${req.body.name} is cool </h1>`);
  } else {
    res.send(
      '<form method="POST"><input type="text" name="username"></input><button type="submit">Create User</button></form>'
    );
  }
});

app.listen(5000);
