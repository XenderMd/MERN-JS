const axios = require('axios');
const HttpError = require('../models/http-error');

const result = require('dotenv').config({path: __dirname + `\\keys.env`});

async function getCoordsForAddress(address){

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.googleAPIKey}`);

    const data=response.data;

    let coordinates;

    if (!data || data.status === "ZERO_RESULTS") {
      const error = new HttpError(
        "Could not find location for the specified address",
        422
      );
      throw(error);
    } else {
        coordinates=data.results[0].geometry.location;
    }

    return(coordinates);
}

module.exports=getCoordsForAddress;