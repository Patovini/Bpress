const Sequelize = require('sequelize');
const connection = require('../database/database.js');

//criando tabelas no bd

const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false,   
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});

User.sync({force: false});

module.exports = User;
