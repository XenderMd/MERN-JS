const express = require("express");
const {check} = require("express-validator");

const userControllers= require('../controllers/users-controllers');

const router = express.Router();

router.get('/', userControllers.getUsers);

router.post('/singup',[check('name').not().isEmpty(), check('email').isEmail(), check('password').not().isEmpty()], userControllers.userSignup);

router.post('/login',[check('email').isEmail(), check('password').not().isEmpty()], userControllers.userLogin);

module.exports = router;
