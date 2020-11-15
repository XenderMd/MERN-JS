const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const environment = require('dotenv').config({path: __dirname + `\\keys.env`});
const placesRouter = require("./routes/places-routes");
const userRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouter); //=> //api/places/...

app.use("/api/users", userRouter); //=> //api/users...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An uknown error has occured" });
});

mongoose.connect(`mongodb+srv://placesApp:${process.env.mongoDBPassword}@myapp.q4c3t.mongodb.net/PlacesDB?retryWrites=true&w=majority`)
.then(()=>{app.listen(5000);})
.catch((err)=>{console.log(err)});
