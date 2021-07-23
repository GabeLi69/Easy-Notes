// Require all of the libraries needed

// In-built Node Modules
const fs = require("fs");
const path = require("path");

// NPM installed modules
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const handlebars = require("express-handlebars");

const express = require("express");
const app = express();
require("dotenv").config();
const config = require("./config.json")[process.env.NODE_ENV || "development"];

// Get all user generated modules into the application 
const AuthChallenger = require("./AuthChallenger");
const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Router/NoteRouter");

// Set up connection to postgres database via knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

// Set up handlebars as our view engine - handlebars will responsible for rendering our HTML
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serves the public directory to the root of our server
app.use(express.static("public"));

// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up basic auth
app.use(
  basicAuth({
    authorizeAsync: true,
    authorizer: AuthChallenger(knex),
    challenge: true,
    realm: "Note Taking Application",
  })
);

// Setup noteService
const noteService = new NoteService(knex);
app.get("/", (req, res) => {
  res.render("index", {
    user: req.auth.user,
  });
});

// Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
app.use("/api/info", new NoteRouter(noteService).router()); //sending our data

// Set up the port that we are going to run the application on, therefore the port that we can view the application from our browser.
app.listen(config.port);

module.exports.app = app;

