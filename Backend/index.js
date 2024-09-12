const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors"); // Corrected from "cros" to "cors"
var multer = require("multer");
const indexRouter = require("./routes/index");
const db = require("./db")


// Load environment variables
const envPath = "./secret/secret_cred";
dotenv.config({ path: envPath });

const basepath = process.env.BASEPATH;
const port = process.env.PORT || 3000; // Added PORT, defaults to 3000 if not provided

const upload = multer({ dest: "./storage/excel-files" });

const app = express();

// Setting up views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware setup
app.use(logger("dev"));
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); // Use CORS middleware
db.connect();
// console.log(basepath)
// Use router for base path
app.use(basepath + "/", indexRouter);

// Secure route for the base path
app.get(basepath + '/', function (req, res) {
  res.send(`
    <h3 style="text-align: center; padding: 10% 0; text-transform: uppercase;">
        !! This is a secure connection, hence cannot be accessed !!
    </h3>`);
});

// Handle 404 errors for GET and POST requests
// app.get(basepath + '*', function(req, res) {
//   res.status(404).send({ status: 'error', message: 'Page Not Found' });
// });
// app.post(basepath + '*', function(req, res) {
//   res.status(404).send({ status: 'error', message: 'Page Not Found' });
// });

// Catch 404 and forward to error handler for other requests
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start server and listen on the provided port
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

module.exports = app;
