const express = require("express");
const passport = require("passport"); // This works for the authentication
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config(); // This helps to have access to the enviroment variables through the mongoose database

// Import the two routes needed books and auth below
const booksRoute = require("./routes/books");
const authRoute = require("./routes/auth");

require("./db").connectToMongoDB(); // This connects to the MonggoDB database.

require("./authentication/auth"); // This serves as signup and login auth middleware. a seperate file created called auth.js
// const session = require('express-session'); // session middlware

const PORT = 9000;
const app = express();

// app.use(bodyParser.urlencoded('jwt', {session: false}), booksRoute); // This help pass the body object

app.use(cors()); // this allows the request from origin.
app.use(bodyParser.urlencoded({ extended: true })); // Explicitly set the 'extended' option || Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());

// app.set('views', 'views');
app.set('view engine', 'ejs');

app.use("/", authRoute); // This defines the route MW authentication
app.use("/books", passport.authenticate("jwt", { session: false }), booksRoute); // This helps to authenticate and protect the routes with jwt.

// The section below renders the home page route

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// This section below handles the errors for the MW

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server started successfully on PORT: http://localhost:${PORT}`);
});
