const express = require('express')

const router = express.Router()

const {signUp, signIn, signOut} = require("../controllers/user");
const {userSignupValidator} = require('../validator')

router.post("/signup", userSignupValidator, signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);

module.exports = router
