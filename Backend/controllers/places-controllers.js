const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

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
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    error = new HttpError(
      "Something went wrong - could not find a place ",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find the place for the provided place id",
      404
    );
    return next(error);
  }

  res.json(place.toObject({ getters: true }));
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError(
        " Something went wrong - could not find places for the provided user id",
        500
      )
    );
  }

  if (places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id", 404)
    );
  }

  res.json(places.map((place) => place.toObject({ getters: true })));
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { title, description, address, creator } = req.body;

    let coordinates;

    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

    const createdPlace = new Place({
      title,
      description,
      address,
      creator,
      location: coordinates,
      image:
        "https://i.pinimg.com/280x280_RS/dc/f5/33/dcf533f965c3ad3315ba7f2a1c8542c4.jpg",
    });

    let user;

    try {
      user = await User.findById(creator);
    } catch (err) {
      const error = new HttpError(
        "Creating place failed, please try again",
        500
      );
      return next(error);
    }

    if (!user) {
      const error = new HttpError(
        "We could not find an user for the provided ID",
        500
      );
      return next(error);
    }

    console.log(user);

    try {
      
      const session = await mongoose.startSession();
      session.startTransaction();
      await createdPlace.save({session});
      user.places.push(createdPlace);
      await user.save({session});
      await session.commitTransaction();

    } catch (err) {
      const error = new HttpError(
        "Creating place failed, please try again",
        500
      );
      return next(error);
    }

    res.status(201).json(createdPlace);
  } else {
    return next(new HttpError("Invalid inputs - please check your data", 422));
  }
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  const placeId = req.params.pid;
  let place;

  if (errors.isEmpty()) {
    try {
      place = await Place.findById(placeId);
      const { title, description } = req.body;
      place.title = title;
      place.description = description;
    } catch (err) {
      return next(
        new HttpError(
          "Something went wrong - could not update place by ID",
          500
        )
      );
    }
  }

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong - could not update place by ID", 500)
    );
  }

  res.status(200).json(place.toObject({ getters: true }));
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong - could not delete place",
      500
    );
    return next(error);
  }

  try {
    if (place) {
      await place.remove();
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong - could not delete place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
