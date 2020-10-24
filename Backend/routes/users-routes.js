const express = require("express");

const userControllers= require('../controllers/users-controllers');

const router = express.Router();

router.get('/', userControllers.getUsers);

router.post('/singup', userControllers.userSignup);

router.post('/login', userControllers.userLogin);

module.exports = router;
