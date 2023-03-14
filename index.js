require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;
const {auth} = require("express-openid-connect")
const { User, Recipe } = require('./db');
const bcrypt = require('bcrypt');
const { requiresAuth } = require('express-openid-connect');


const {SECRET, BASE_URL, CLIENT_ID, ISSUER_BASE_URL} = process.env;

//AuthO
const config = {
  authRequired: true,
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASE_URL,
  clientID: CLIENT_ID,
  issuerBaseURL: ISSUER_BASE_URL
}

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(auth(config));

app.get('/', (req, res, next) => {
  try {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  } catch (error) {
    console.log(error)
    next(error);
  }
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


//Read recipes
app.get('/recipes', async (req, res, next) => {
  try {
    var recipes = await Recipe.findAll();
    if (req.oidc.user["email"] != "admin@email.com") {
      recipes = await Recipe.findAll({where: {email: req.oidc.user["email"] }});
    }
    res.send(recipes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//Read one recipe
app.get('/recipes/:id', async (req, res, next) => {
  try {
    var recipe = await Recipe.findOne({ where: { id: req.params.id}})
    if (req.oidc.user["email"] != "admin@email.com") {
      recipe = await Recipe.findOne({
        where: { id: req.params.id, email: req.oidc.user["email"]}
      });
    }
    if(!recipe) {
      res.status(500).send("Recipe not found in Bikini Bottom!");
    } else {
      res.status(200).send(recipe);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//Create recipe
app.post('/recipes/create', async (req, res, next) => {
  try {
    var body = req.body;
    body["email"] = req.oidc.user["email"]
    const newRecipe = await Recipe.create(body);
    res.send({newRecipe});
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//Delete recipe
app.delete('/recipes/delete/:id', async (req, res, next) => {
  try {
    var deletedRecipe;
    if (req.oidc.user["email"] != "admin@email.com") {
      deletedRecipe = await Recipe.destroy({
        where: {id: req.params.id, email: req.oidc.user["email"]}
      });
    } else {
      deletedRecipe = await Recipe.destroy({
        where: {id: req.params.id}
      });
    }

    if (deletedRecipe) {
      res.send("Succesfully deleted!");
    } else {
      res.status(500).send("Recipe not found in Bikini Bottom!")
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//Edit recipe
app.put('/recipes/update/:id', async (req, res, next) => {
  try {
    var recipe = await Recipe.findOne({
      where: {id: req.params.id}
    });
    if (req.oidc.user["email"] != "admin@email.com") {
      recipe = await Recipe.findOne({
        where: {id: req.params.id, email: req.oidc.user["email"]}
      });
    }
    const update = await recipe.update(req.body);
    const updatedRecipe = await recipe.save();
    res.send(updatedRecipe);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
  console.log(`Secret recipes at http://localhost:${PORT}`);
});
