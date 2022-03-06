const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const Notes = require('../models/books');

const NotesController = {};

NotesController.getNotes = (token, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    let userID = authUser._id;

    Notes.getAll(userID, (error, books) => {
      if (error) {
        return callback(500, 'Impossible de récupérer la liste de livres');
      }
      return callback(200, null, books);
    });
  });
};

NotesController.addNote = (token, bookContent, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    const userID = authUser._id;

    Notes.add(bookContent, userID, (error, book) => {
      if (error) {
        return callback(500, 'Impossible de créer le livre');
      }
      if (book) {
        return callback(200, null, book);
      }
    });
  });
};

NotesController.modifyNote = (token, bookID, bookContent, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, async (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    let formattedNoteID;
    try {
      formattedNoteID = new ObjectID(bookID);
    } catch (error) {
      return callback(404, 'Cet identifiant est inconnu');
    }

    Notes.get(formattedNoteID, (error, book) => {
      if (error || !book) {
        return callback(404, 'Cet identifiant est inconnu');
      }
      if (book.userId !== authUser._id) {
        return callback(403, 'Accès non autorisé à ce livre');
      }

      Notes.patch(book._id, bookContent, (error, book) => {
        if (error || !book) {
          return callback(500, 'Impossible de modifier le livre');
        }
        return callback(200, null, book.value);
      });
    });
  });
};

NotesController.deleteNote = (token, bookID, callback) => {
  if (!token) {
    return callback(401, 'Utilisateur non connecté');
  }

  jwt.verify(token, process.env.JWT_KEY, async (error, authUser) => {
    if (error || !authUser) {
      return callback(401, 'Utilisateur non connecté');
    }

    let formattedNoteID;
    try {
      formattedNoteID = new ObjectID(bookID);
    } catch (error) {
      return callback(404, 'Cet identifiant est inconnu');
    }

    Notes.get(formattedNoteID, (error, book) => {
      if (error || !book) {
        return callback(404, 'Cet identifiant est inconnu');
      }
      if (book.userId !== authUser._id) {
        return callback(403, 'Accès non autorisé à ce livre');
      }

      Notes.delete(book._id, (error) => {
        if (error) {
          return callback(500, 'Impossible de supprimer le livre.');
        }
        return callback(200);
      });
    });
  });
};

module.exports = NotesController;