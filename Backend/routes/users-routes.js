const express = require("express");
const {check} = require("express-validator");

const userControllers= require('../controllers/users-controllers');

const router = express.Router();

router.get('/', userControllers.getUsers);

router.post('/signup',[check('name').not().isEmpty(), check('email').isEmail(), check('password').isLength({min:6})], userControllers.userSignup);

router.post('/login',[check('email').isEmail(), check('password').not().isEmpty()], userControllers.userLogin);

module.exports = router;
