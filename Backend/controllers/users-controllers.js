const { v4: uuid } = require("uuid");
const {validationResult}=require('express-validator');

const HttpError = require("../models/http-error");
const User = require('../models/user');
const e = require("express");

let DUMMY_USERS = [
  {
    id: "u1",
    email: "user.username@email.com",
    password: "some password",
    image: "some url",
    placesNumber: 6,
  },
];

const getUsers = (req, res, next) => {
  res.status(200).send(DUMMY_USERS);
};

const userSignup = async (req, res, next) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {

      const { email, password, image, name, places } = req.body;
      let existingUser;

      try {
         existingUser= await User.findOne({email});
      } catch (err) {
          const error = new HttpError('Signing up failed - please try again later', 500);
          return next(error);
      }

      if(existingUser){
        const error = new HttpError('User exists already - please login instead', 422);
        return next(error);
      }

      const createdUser = new User({
        name,
        email,
        image: 'https://static.wikia.nocookie.net/thekaratekid/images/9/9e/John_Kreese_Karate_Kid.png/revision/latest?cb=20190430011315',
        password,
        places
      });

      try {
        await createdUser.save();
      } catch (err) {
        const error = new HttpError(
          "Signing up failed - please try again later",
          500
        );
        return next(error);
      }
      
      res.status(201).json({user:createdUser.toObject({getters:true})});
      
    } else {
      return next(new HttpError("Invalid singup data", 422));
    }
};

const userLogin = async (req, res, next) => {

  const errors = validationResult(req);

  if(errors.isEmpty()){

    const { email, password } = req.body;

    let existingUser;

    try {
     existingUser= await User.findOne({email});
    } catch (err) {
      const error = new HttpError('Login failed - please try again later', 500);
      return next(error);
    }

    if(!existingUser||existingUser.password!==password){
      const error = new HttpError('Login failed - invalid email and/or password', 401);
      return next(error);
    } 
    
  } else {
    const error = new HttpError('Login failed - invalid email and/or password', 401);
    return next(error);
  }

  res.status(200).json({message:"Login succesful"});

};

exports.getUsers = getUsers;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
