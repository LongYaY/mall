var express = require("express");
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
// router.get("/login", function (req, res, next) {
//   res.sendFile(path.join(__dirname, "../views/login.html"));
// });
// router.get("/user", function (req, res, next) {
//   res.sendFile(path.join(__dirname, "../views/user.html"));
// });

module.exports = router;
