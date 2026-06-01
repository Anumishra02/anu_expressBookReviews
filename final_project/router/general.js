const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 10: Get all books – using Axios with async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Fallback to local data to avoid infinite loop during initial load
    return res.status(200).json(books);
  }
});

// Task 11: Get book details based on ISBN – using Axios with Promise callback
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(() => {
      // Fallback to local lookup
      const book = books[isbn];
      if (book) {
        return res.status(200).json(book);
      }
      return res.status(404).json({ message: "Book not found" });
    });
});

// Task 12: Get book details based on author – using Axios with async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Fallback to local search
    const author = req.params.author;
    const booksByAuthor = {};
    for (const isbn in books) {
      if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
        booksByAuthor[isbn] = books[isbn];
      }
    }
    if (Object.keys(booksByAuthor).length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }
    return res.status(200).json(booksByAuthor);
  }
});

// Task 13: Get all books based on title – using Axios with async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${req.params.title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Fallback to local search
    const title = req.params.title;
    const booksByTitle = {};
    for (const isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        booksByTitle[isbn] = books[isbn];
      }
    }
    if (Object.keys(booksByTitle).length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }
    return res.status(200).json(booksByTitle);
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;