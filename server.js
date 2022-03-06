const restify = require('restify');

const database = require('./database');
const UserController = require('./controllers/user-controller');
const BooksController = require('./controllers/books-controller');
const Users = require('./models/users');



require('dotenv').config();

const app = restify.createServer();

(async () => {
  await database.connect();

  app.use(restify.plugins.bodyParser());

  // Sign up
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    UserController.signup(
      username,
      password,
      (statusCode, errorMessage, token) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          token: token
        });
      }
    );
  });

  // Sign in
  app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    UserController.signin(
      username,
      password,
      (statusCode, errorMessage, token) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          token: token
        });
      }
    );
  });



  // Patch book
  app.patch('/books/:id', (req, res) => {
    const token = req.header('x-access-token');
    const bookID = req.params.id;
    const bookContent = req.body.content;

    BooksController.modifyBook(
      token,
      bookID,
      bookContent,
      (statusCode, errorMessage, book) => {
        if (statusCode !== 200) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }
        return res.send(200, {
          error: null,
          book: book
        });
      }
    );
  });

// Get books
app.get('/books', (req, res) => {
  const token = req.header('x-access-token');

  BooksController.getBooks(token, (statusCode, errorMessage, books) => {
    if (statusCode !== 200) {
      return res.send(statusCode, {
        error: errorMessage
      });
    }
    return res.send(200, {
      error: null,
      books: books
    });
  });
});



   // Add book
   app.post('/books', (req, res) => {
    const token = req.header('x-access-token');
    const bookTitle = req.body.title || '';
    const bookAuthor = req.body.author || '';
    const bookOverview = req.body.overview || '';
    const bookPicture = req.body.picture || '';
    const bookReadCount = req.body.read_count || '';


    BooksController.addBook(
      token,
      bookTitle,
      bookAuthor,
      bookOverview,
      bookPicture,
      bookReadCount,

      (statusCode, errorMessage, book) => {
        if (statusCode !== 201) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }

        if (statusCode === 422) {
          return res.send(statusCode, {
            error: errorMessage
          });
        }

        return res.send(201, {
          error: null,
          book: book
        });
      }
    );
  });



  
  // Delete book
  app.del('/books/:id', (req, res) => {
    const token = req.header('x-access-token');
    const bookID = req.params.id;

    BooksController.deleteBook(token, bookID, (statusCode, errorMessage) => {
      if (statusCode !== 200) {
        return res.send(statusCode, {
          error: errorMessage
        });
      }
      return res.send(200, {
        error: null
      });
    });
  });

  app.listen(process.env.PORT, function () {
    console.log(`App listening on PORT ${process.env.PORT}`);
  });
})();
