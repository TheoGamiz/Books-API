const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
var isbn = require('node-isbn');
require('dotenv').config();

const Books = require('../models/books');

const BooksController = {};

BooksController.getBooks = (token, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    let userID = authUser.isbn;

    Books.getAll(userID, (error, books) => {
      if (error) {
        return callback(500, 'Impossible de récupérer la liste de livres');
      }
      return callback(200, null, books);
    });
  });
};

BooksController.addBook = (token, bookContent, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    const userID = authUser.isbn;

    Books.add(bookContent, userID, (error, book) => {
      if (error) {
        return callback(500, 'Impossible de créer le livre');
      }
      if (book) {
        return callback(200, null, book);
      }
    });
  });
};

BooksController.modifyBook = (token, bookID, bookContent, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, async (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    let formattedBookID;
    try {
      formattedBookID = new isbn(bookID);
    } catch (error) {
      return callback(404, 'Cet identifiant est inconnu');
    }

    Books.get(formattedBookID, (error, book) => {
      if (error || !book) {
        return callback(404, 'Cet identifiant est inconnu');
      }
      if (book.userId !== authUser.isbn) {
        return callback(403, 'Accès non autorisé à ce livre');
      }

      Books.patch(book._isbn, bookContent, (error, book) => {
        if (error || !book) {
          return callback(500, 'Impossible de modifier le livre');
        }
        return callback(200, null, book.value);
      });
    });
  });
};

BooksController.deleteBook = (token, bookID, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, async (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    let formattedBookID;
    try {
      formattedBookID = new isbn(bookID);
    } catch (error) {
      return callback(404, 'Cet identifiant est inconnu');
    }

    Books.get(formattedBookID, (error, book) => {
      if (error || !book) {
        return callback(404, 'Cet identifiant est inconnu');
      }
      if (book.userId !== authUser.isbn) {
        return callback(403, 'Accès non autorisé à ce livre');
      }

      Books.delete(book.isbn, (error) => {
        if (error) {
          return callback(500, 'Impossible de supprimer le livre.');
        }
        return callback(200);
      });
    });
  });
};

module.exports = BooksController;