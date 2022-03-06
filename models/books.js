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
Books.add = (title, author, overview, picture, read_count, callback) => {
  const booksCollection = database.db.collection('books');

  const book = {
    title: title,
    author: author,
    overview : overview,
    picture: picture,
    read_count: read_count,

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
