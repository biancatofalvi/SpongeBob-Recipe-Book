const { sequelize } = require('./db');
const { User } = require('./');
const { Recipe } = require('./');
const { users, recipes } = require('./seedData');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        const createdUsers = await User.bulkCreate(users);
        const createdRecipes = await Recipe.bulkCreate(recipes);
        for(let i=0; i<createdRecipes.length; i++){
            let recipe = createdRecipes[i];
            const userId = createdUsers[i%3].id;
            await recipe.setUser(userId);
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = seed;
