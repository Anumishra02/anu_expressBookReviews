<<<<<<< HEAD
// auth_users.js
=======

>>>>>>> 6a61a9d (completed async implementation)
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

<<<<<<< HEAD
const isValid = (username) => {
  // Check if username is valid (at least 3 characters, alphanumeric)
  return username && username.length >= 3 && /^[a-zA-Z0-9]+$/.test(username);
};

const authenticatedUser = (username, password) => {
  // Check if username and password match the one we have in records
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
=======
// Check if username is valid
const isValid = (username) => {
  return username && username.length >= 3;
};

// Check if user exists
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
>>>>>>> 6a61a9d (completed async implementation)
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

<<<<<<< HEAD
  // Create JWT token
  const token = jwt.sign({ username: username }, "secret_key", { expiresIn: '1h' });
  
  return res.status(200).json({
    message: "Login successful",
    token: token
=======
  // Generate JWT token
  const accessToken = jwt.sign({ username: username }, "secret_key", { expiresIn: "1h" });

  // Store token in session
  req.session.accessToken = accessToken;

  return res.status(200).json({
    message: "Login successful"
>>>>>>> 6a61a9d (completed async implementation)
  });
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
});



// Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
<<<<<<< HEAD
  const username = req.user.username; // Assuming JWT middleware sets req.user

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const book = books[isbn];
=======
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  const book = books[isbn];

>>>>>>> 6a61a9d (completed async implementation)
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

<<<<<<< HEAD
  // Add or update the review
  book.reviews[username] = review;
  
=======
  // Add or update review
  book.reviews[username] = review;

>>>>>>> 6a61a9d (completed async implementation)
  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


