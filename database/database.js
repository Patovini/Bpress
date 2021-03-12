const Sequelize = require('sequelize');

const connection = new Sequelize('bpress','root','1230',{
    host: 'localhost',
    dialect: 'mysql', 
    timezone: "-03:00"
});

module.exports = connection;