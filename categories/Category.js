const Sequelize = require('sequelize');
const connection = require('../database/database.js');

//criando tabelas no bd

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,   
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});


//sincronizando os modulos para criar os relacionamentos no mysql  
// Category.sync({force: true});
//o codigo acima so deve ser rodado na primeira vez para nao ficar criando uma tabela em cima da outra


module.exports = Category;
