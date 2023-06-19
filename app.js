require("dotenv").config();

const express = require("express");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
app.use(express.json());
app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers.js");

//---------public routes--------------------------------
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

//---------login route----------------------------------
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);
app.post("/api/users", hashPassword, userHandlers.postUser);

//---------protected routes-----------------------------
app.use(verifyToken);// authentication wall : verifyToken is activated for each route after this line

//---------movies routes--------------------------------
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

//---------users routes---------------------------------
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

//---------server connection----------------------------
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
