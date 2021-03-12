const Sequelize = require('sequelize');
const connection = require('../database/database.js');
const Category = require('../categories/Category.js');

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Criando relacionamentos no sequelize(bd)

Category.hasMany(Article); //1 categoria pode ter muitos artigos ( 1-p-m)
Article.belongsTo(Category); // 1 artigo pode ter uma 1 categoria (1-p-1)

//sincronizando os modulos para criar os relacionamentos no mysql  
// Article.sync({force: true});
//o codigo acima so deve ser rodado na primeira vez para nao ficar criando uma tabela em cima da outra


module.exports = Article;