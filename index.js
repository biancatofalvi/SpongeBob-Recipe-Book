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

//Add recipes
app.post('/create/recipe', async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(200).send(recipe);
  } catch (error) {
    console.error(error);
  }
});


//Add users

//Delete recipes

//Delete users

//Edit recipes

//Edit users


// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
  console.log(`Secret recipes at http://localhost:${PORT}`);
});
