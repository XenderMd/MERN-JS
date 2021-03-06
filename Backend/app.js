const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require ('fs');
const path = require('path');

const placesRouter = require("./routes/places-routes");
const userRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join('uploads', 'images')));

app.use((req,res,next)=>{

  res.setHeader('Access-Control-Allow-Origin', '*'); // to address CORS errors 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use("/api/places", placesRouter); //=> //api/places/...

app.use("/api/users", userRouter); //=> //api/users...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {

  if(req.file){
    fs.unlink(req.file.path, (err)=>{
      if(err){console.log(err);};
    });
  };

  console.log(error);

  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An uknown error has occured" });
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myapp.q4c3t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(()=>{app.listen(5000);})
.catch((err)=>{console.log(err)});
