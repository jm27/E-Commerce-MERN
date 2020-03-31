const User = require('../models/user')
const jwt = require('jsonwebtoken'); // Generate sign in token
const expressJwt = require('express-jwt');// Authorization check token
const {errorHandler} = require('../helpers/dbErrorHandler')


exports.signUp = (req, res) => {
    console.log('req.body', req.body)
    const user = new User(req.body);
    user.save((err, user)=>{
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        });
    })
};

exports.signIn = (req, res) => {
    console.log('req.body', req.body)
    // find users by email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "User with that email does not exist. Please sign up!"
            })
        }
        // if user is found make sure email and password match
        // create athenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: 'Email and password dont match'
            })
        }
        // generate a sign token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        // name token as 'c' in cookie with expiry date
        res.cookie('c', token, {expire: new Date() + 9999})
        // Return response with user and token to front end client
        const {_id, name, email, role} = user
        return res.json({token, user: {_id, email, name, role}})
    })
}

exports.signOut = (req, res) => {
    res.clearCookie('c')
    res.json({message : "Successful sign out!"})
}

exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})


exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user) {
        return res.status(403).json({
            error: 'Access denied!'
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0){
        return res.status(403).json ({
error : "Admin resource! Access denied"
        })
    }
    next()
}