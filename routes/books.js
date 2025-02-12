const express = require("express");
const bookModel = require("../models/books");

const booksRoute = express.Router();

// Defining routes for the books

booksRoute.get('/', (req, res) => {
  bookModel
    .find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// Get book byID

booksRoute.get('/:id', (req, res) => {
  const id = req.params.id;
  bookModel
    .findById(id)
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

// Update Book

booksRoute.post('/', (req, res) => {
  const book = req.body;
  book.lastUpdateAt = new Date(); // This helps to set the lastupdate to the current date
  bookModel
    .create(book)
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

module.exports = booksRoute;
