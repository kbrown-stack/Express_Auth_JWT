const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoute = express.Router();

// const router = express.Router;


// Router for user signup
authRoute.post(
    '/signup', 
    passport.authenticate('signup', {session: false}), async (req,res, next) => {
        res.json({
            message:'Signup Successful',
            user: req.user
        });
    }
);

// Router for user login

authRoute.post(
    '/login',
     (req,res, next) => {
        passport.authenticate('login', async (err,user,info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = new Error('UserName or Password not Valid');
                    return next(error);
                    // return res.status(401).json({ message: info ? info.message : 'Login failed' });
                    // return next(error);
                }

                // Log in the user here 

                req.login(user, {session: false}, 
                    async (error) => {
                        if (error) return next(error);

                        // Generate JWT  token below

                        const body = {_id: user._id, email: user.email};
                        const token = jwt.sign({user: body}, process.env.JWT_SECRET, { expiresIn: '1h' }); // This also helps time the log session of the token.
                        // THis helps you store id and email in the payload of the JWT.\
                        //You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                        //Do not store password in the JWT!
                       
                        return res.json({token});
                    });
            } catch  (error) {
                return next(error);
            }

        })(req,res, next);
    }
);


module.exports = authRoute;