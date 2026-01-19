const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username format"});
  }

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Register new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get all books available in the shop
public_users.get('/', function (req, res) {
  // Using Promise to simulate async operation
  new Promise((resolve) => {
    resolve(books);
  })
  .then(booksData => {
    return res.status(200).json({books: booksData});
  })
  .catch(error => {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Using Promise to simulate async operation
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  })
  .then(book => {
    return res.status(200).json({book: book});
  })
  .catch(error => {
    return res.status(404).json({message: error.message});
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  // Using Promise to simulate async operation
  new Promise((resolve) => {
    const booksByAuthor = {};
    for (const isbn in books) {
      if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
        booksByAuthor[isbn] = books[isbn];
      }
    }
    resolve(booksByAuthor);
  })
  .then(filteredBooks => {
    if (Object.keys(filteredBooks).length === 0) {
      return res.status(404).json({message: "No books found by this author"});
    }
    return res.status(200).json({books: filteredBooks});
  })
  .catch(error => {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  // Using Promise to simulate async operation
  new Promise((resolve) => {
    const booksByTitle = {};
    for (const isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        booksByTitle[isbn] = books[isbn];
      }
    }
    resolve(booksByTitle);
  })
  .then(filteredBooks => {
    if (Object.keys(filteredBooks).length === 0) {
      return res.status(404).json({message: "No books found with this title"});
    }
    return res.status(200).json({books: filteredBooks});
  })
  .catch(error => {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  });
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Using Promise to simulate async operation
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book.reviews);
    } else {
      reject(new Error("Book not found"));
    }
  })
  .then(reviews => {
    return res.status(200).json({reviews: reviews});
  })
  .catch(error => {
    return res.status(404).json({message: error.message});
  });
});

module.exports.general = public_users;
