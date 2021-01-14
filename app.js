require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require("./models/User");


/**
 * Controllers (route handlers).
 */
const musclesController = require("./controllers/muscles");
const exerciseController = require("./controllers/exercises");
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const exerciseApiController = require("./controllers/api/exercises");
const savedExerciseApiController = require("./controllers/api/savedExercises");
const savedExerciseController = require("./controllers/savedExercises");

const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */




mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/", homeController.list);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/create-muscles", authMiddleware, (req, res) => {
  res.render("create-muscles", { errors: {} });
});

app.post("/create-muscles", musclesController.create);

app.get("/muscles", musclesController.list);
app.get("/muscles/delete/:id", musclesController.delete);
app.get("/muscle/update/:id", musclesController.edit);
app.post("/muscle/update/:id", musclesController.update);

app.get("/create-exercises", exerciseController.createView);
app.post("/create-exercises", exerciseController.create);

app.get("/exercise", exerciseController.list);
app.get("/exercise/delete/:id", exerciseController.delete);
app.get("/exercise/update/:id",exerciseController.edit);
app.post("/exercise/update/:id", exerciseController.update);

app.get("/search-exercises",(req,res) => {
  res.render('search-exercises', exerciseApiController);
});

app.get("/saved-exercises", savedExerciseController.list);

app.get("/api/search-exercises", exerciseApiController.list);
app.post("/api/saved-exercises", savedExerciseApiController.create);




app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});



app.post("/join", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);


app.listen(PORT, () => {
  console.log(
    `Example app listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});
