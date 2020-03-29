const express = require('express')

const router = express.Router()

const {signUp, signIn} = require("../controllers/user");
const {userSignupValidator} = require('../validator')

router.post("/signup", userSignupValidator, signUp);
router.post("/signin", userSignupValidator, signIn);

module.exports = router
