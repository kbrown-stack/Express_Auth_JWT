// This file serves as a seperate middle ware file to avoid clogging the app.js file.

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/users");

const Jwtstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// const ExtractJWT = require('passport').ExtractJWT;

const customExtractor = (req) => {
  return req.query && req.query.secret_token ? req.query.secret_token : null;  // This is the custom extractor to pull the query from the token parameter
};

// This helps grabs jwt token Strategy  , then check the url parameter if it has secret token

passport.use(
  new Jwtstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      // jwtFromRequest: ExtractJwt.fromUrlQueryParameter("secret_token"),  // Use this code if using a secret_token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()  // Use this if you are using Bearer token.
    },

    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Note that this middleware below saves the information provided by the user to the database,
//and then sends  the user information to the next middleware if successful.
//otherwise it reports an erro.

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.create({ email, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { messsage: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { messsage: "Invalid Password" });
        }

        return done(null, user, { messsage: "Logged in successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

