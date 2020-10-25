  const HttpError = require('../models/http-error');
  const {validationResult} = require('express-validator');
  const {v4: uuid} = require('uuid');

  const getCoordsForAddress=require('../util/location');

  let DUMMY_PLACES = [
    {
      id: "p1",
      title: "Empire State Building",
      description:
        'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan in New York City. It was designed by Shreve, Lamb & Harmon and built from 1930 to 1931. Its name is derived from "Empire State", the nickname of the state of New York.',
      location: {
        lat: "40.7484405",
        long: "-73.9856644",
      },
      address: "20 W 34th St, New York, NY 10001, United States",
      creator: "u1",
    }
  ];


  const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((place) => {
      return place.id === placeId;
    });

    if (!place) {
      throw new HttpError(
        "Could not find the place for the provided place id",
        404
      );
    }

    res.json(place);
  };


  const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter((place) => {
      return place.creator === userId;
    });

    if (!places || places===0) {
      return next(
        new HttpError("Could not find places for the provided user id",
          404)
      );
    }

    res.json(places);
  };

  const createPlace = async (req, res, next)=>{

  const errors=validationResult(req);


  if (errors.isEmpty()) {

    const { title, description, address, creator } = req.body;

    let coordinates;

    try {

      coordinates = await getCoordsForAddress(address);
      
    } catch (error) {

      return next(error);
    
    }
    

    const createdPlace = {
      id: uuid(),
      title,
      description,
      location: coordinates,
      address,
      creator,
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json(createdPlace);
    
  } else {
      return next (new HttpError("Invalid inputs - please check your data", 422));
  }


  };

  const updatePlace = (req, res, next)=>{

    const errors = validationResult(req);

    if (!errors) {
        const placeId = req.params.pid;
        const place = DUMMY_PLACES.find((place) => {
        return place.id === placeId;
      });

      if (place) {
        
        const { title, description } = req.body;
        const placeIndex = DUMMY_PLACES.findIndex((place) => {
          return place.id === placeId;
        });

        const updatedPlace = { ...place, title, description };

        DUMMY_PLACES[placeIndex] = updatedPlace;

        console.log(DUMMY_PLACES);

        res.status(200).json(updatedPlace);
      } else {
        res.status(404).send("Place not found");
      }
    } else {
      throw(new HttpError("Invalid request - please cehck your place data", 422));
    }
  };

  const deletePlace=(req, res, next)=>{

  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((place) => {
    return place.id === placeId;
  });

  if(place){

    DUMMY_PLACES = DUMMY_PLACES.filter((place)=>{return place.id!==placeId});

    console.log(DUMMY_PLACES);

    res.status(200).json(placeId);

  } else {

    res.status(404).send('Place not found');

  }

  };


  exports.updatePlace=updatePlace;
  exports.deletePlace=deletePlace;
  exports.getPlaceById=getPlaceById;
  exports.getPlacesByUserId=getPlacesByUserId;
  exports.createPlace=createPlace;
