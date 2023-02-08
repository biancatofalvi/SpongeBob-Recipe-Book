const { sequelize } = require('./db');
const seed = require('./seedFn');

seed()
    .then(() => {
        console.log('Seeding success. SpongeBob recipes ready for the greatest chef!');
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        sequelize.close();
    });
