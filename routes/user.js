const express = require('express')

const router = express.Router()

const {signUp} = require("../controllers/user");

router.get("/signup",signUp);

module.exports = router
