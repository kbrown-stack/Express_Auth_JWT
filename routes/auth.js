const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoute = express.Router();

// const router = express.Router;


// Router for user signup

authRoute.post('/signup', 
    passport.authenticate('signup', {session: false}), 
    async (req,res, next) => {
        res.json({
            message:'Signup Successful',
            user: req.user
        });
    }
);

// GET Login Page for (EJS)
authRoute.get("/login", (req, res) => {
    res.render("login", { message: null });
  });

// Router for user login

authRoute.post('/login', (req,res, next) => {
        passport.authenticate('login', async (err,user,info) => {
            try {
                if (err)  return next(err);
                
                if (!user) {
                    return res.render('login', {message:'UserName or Password not Valid'});
                }
                // Log in the user here 

                req.login(user, {session: false},  async (error) => {
                        if (error) return next(error);

                        // Generate JWT  token below

                        // const body = {_id: user._id, email: user.email};
                        const token = jwt.sign({user: {_id: user._id,email:user.emailbody}}, process.env.JWT_SECRET, { expiresIn: '1h'} ); // the 1hour  also helps time the log session of the token.
                        // THis helps you store id and email in the payload of the JWT.\
                        //You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                        //Do not store password in the JWT!
                       
                        return res.json({token});
                    });
            } catch  (error) {
                return next(error);
            }

        })(req,res, next);

        // Logout Route For GET and POST Method.

authRoute.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  
  authRoute.post("/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

    }
);


module.exports = authRoute;