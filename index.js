require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;
const { User, Recipe } = require('./db');

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Read recipes
app.get('/recipes', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll();
    res.send(recipes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Read users
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Read one recipe
app.get('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({
      where: { id: req.params.id }
    });
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

//Read one user
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.params.id}
    });
    if(!user) {
      res.status(500).send("User not found in Bikini Bottom!");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Create recipe
app.post('/recipes/create', async (req, res, next) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.send({newRecipe});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Create user
app.post('/users/create', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.send({newUser});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Delete recipe
app.delete('/recipes/:id', async (req, res, next) => {
  try {
    const deltedRecipe = await Recipe.destroy({
      where: {id: req.params.id}
    });
    if (deltedRecipe) {
      res.send("Succesfully deleted!");
    } else {
      res.status(500).send("Recipe not found in Bikini Bottom!")
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Delete user
app.delete('/users/:id', async (req, res, next) => {
  try {
    const deltedUser = await User.destroy({
      where: {id: req.params.id}
    });
    if (deltedUser) {
      res.send("Succesfully deleted!");
    } else {
      res.status(500).send("User not found in Bikini Bottom!")
    }
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
