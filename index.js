require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;
const {auth} = require("express-openid-connect")
const { User, Recipe } = require('./db');

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

app.use(async (req, res, next) => {
  const [user] = await User.findOrCreate({where: {username: req.oidc.user[username], name: req.oidc.user[name], email: req.oidc.user[email]}});
  next();
})

app.get('/', (req, res, next) => {
  try {
    console.log(req.oidc.user);
    res.send(`<h1>Spongebob's Recipes</h1><h2>Username:${req.oidc.user[nickname]}</h2><h2>${req.oidc.user[email]}</h2><img href=${req.oidc.user[picture]}></img>`)
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
  } catch (error) {
    console.log(error)
    next(error);
  }
});

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

const hashPassword = async (password, SALT_COUNT) => {
  const hash = await bcrypt.hash(password, SALT_COUNT);
  return hash;
}

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

//Edit recipe
app.put('/recipes/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({
      where: {id: req.params.id}
    });
    const update = await recipe.update(req.body);
    const updatedRecipe = await recipe.save();
    res.send(updatedRecipe);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Edit user
app.put('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.params.id}
    });
    const update = await user.update(req.body);
    const updatedUser = await user.save();
    res.send(updatedUser);
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
