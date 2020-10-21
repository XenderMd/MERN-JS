const express = require("express");
const bodyParser= require('body-parser');

const placesRouter=require('./routes/places-route');

const app = express();

app.use('/api/places', placesRouter); //=>//api/places/...

app.listen(5000);