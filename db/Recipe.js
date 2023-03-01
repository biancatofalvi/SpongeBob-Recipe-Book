const {Sequelize, sequelize} = require('./db');

const Recipe = sequelize.define('recipe', {
    title: Sequelize.STRING,
    secretIngredient: Sequelize.STRING,
    stars: Sequelize.INTEGER,
    email: Sequelize.STRING
});

module.exports = { Recipe };
