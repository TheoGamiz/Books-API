const database = require('../database');

const Books = {};

// Get books
Books.getAll = (userID, callback) => {
  const booksCollection = database.db.collection('books');

  booksCollection
    .find({
      userId: userID
    })
    .toArray(callback);
};

// Get book
Books.get = (bookID, callback) => {
  const booksCollection = database.db.collection('books');

  booksCollection
    .find({
      isbn: bookID
    })
    .sort({
      createdAt: -1
    })
    .toArray((error, books) => {
      return callback(error, books[0]);
    });
};

// Add book
Books.add = (content, userID, callback) => {
  const booksCollection = database.db.collection('books');

  const book = {
    content: content,
    userId: userID,
    createdAt: new Date(),
    lastUpdatedAt: null
  };

  booksCollection.insertOne(book, (error, addedBook) => {
    callback(error, {
      isbn: addedBook.insertedId,
      ...book
    });
  });
};

// Patch book
Books.patch = (bookID, bookContent, callback) => {
  const booksCollection = database.db.collection('books');

  booksCollection.findOneAndUpdate(
    {
      isbn: bookID
    },
    {
      $set: {
        content: bookContent,
        lastUpdatedAt: new Date()
      }
    },
    {
      returnOriginal: false
    },
    callback
  );
};

// Delete book
Books.delete = (bookID, callback) => {
  const booksCollection = database.db.collection('books');

  booksCollection.deleteOne(
    {
      isbn: bookID
    },
    callback
  );
};

module.exports = Books;
