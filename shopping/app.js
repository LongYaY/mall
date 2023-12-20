var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { expressjwt: jwt } = require("express-jwt");

//解决跨域
const cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config();

// var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var shopRouter = require("./routes/shop");

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  jwt({ secret: process.env.SECRETKEY, algorithms: ["HS256"] }).unless({
    path: [
      "/public",
      "/api/register",
      "/api/login",
      "/shop/list",
      /^\/uploads\/.*/,
    ],
  })
);

// app.use("/", indexRouter);
app.use("/api", userRouter);
app.use("/shop", shopRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
