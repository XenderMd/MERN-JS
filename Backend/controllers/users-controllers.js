const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const {validationResult}=require('express-validator');

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

const userSignup = (req, res, next) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {

      const { email, password, image, name } = req.body;
      const foundUser = DUMMY_USERS.find((user) => {
        return user.email === email;
      });

      if (foundUser) {
        return res.status(402).send("Email already in use !");
      } else {
        const newUser = {
          id: uuid(),
          email,
          password,
          name,
          image,
        };

        DUMMY_USERS.push(newUser);

        console.log(DUMMY_USERS);

        res.status(201).send("Signup succesful !");
      }
    } else {
      throw new HttpError("Invalid singup data", 422);
    }
};

const userLogin = (req, res, next) => {

  const errors = validationResult(req);
  if(errors.isEmpty()){
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((user) => {
    return user.email === email;
  });

  if (user) {
    if (user.password === password) {
      return res.status(202).send("Login successful !");
    } else {
      return res
        .status(401)
        .send("Login unsuccessful - please check your password ! ");
    }
  } else {
    return res.status(404).send("Login unsuccessful - user not found");
  }}else{
      throw (new HttpError('Invalid login data', 422));
  }
};

exports.getUsers = getUsers;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
