const {validationResult}=require('express-validator');
const bcrypt = require ('bcrypt');

const HttpError = require("../models/http-error");
const User = require('../models/user');

const getUsers = async (req, res, next) => {

  let users;

  try {
    users = await User.find({}, 'name places image')
  } catch (err) {
    const error = new HttpError('Something went wrong - could not fetching users', 500);
    return next(error);
  }

  res.status(200).json({users: users.map((user)=>{return user.toObject({getters:true})})});
};

const userSignup =async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;

  try {

    hashedPassword = await bcrypt.hash(password, 12);

  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const userLogin = async (req, res, next) => {

  let existingUser;
  const errors = validationResult(req);

  if(errors.isEmpty()){

    const { email, password } = req.body;
    
    try {
     
      existingUser = await User.findOne({email}, 'name password');
     
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

  res.status(200).json({user:existingUser.toObject({getters:true})});
};

exports.getUsers = getUsers;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
