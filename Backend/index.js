const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cros = require('cors');
var multer = require('multer');
const indexRouter = require('./routes/index');


const envPath = "./secret/secret_cred";

const upload = multer({dest:'./storage/excel-files'})

const app = express();

try {
dotenv.config({ path: envPath });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(upload.any())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cros())

app.use('/', indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

} catch (e) {
  console.error(e)
}

// catch 404 and forward to error handler

module.exports = app;
