const { Recipe } = require('./Recipe');
const { User } = require('./User');
const { sequelize, Sequelize } = require('./db');

Recipe.belongsTo(User, {foreignKey: 'ownerId'});
User.hasMany(Recipe);

module.exports = {
    Recipe,
    User,
    sequelize,
    Sequelize
};
