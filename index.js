const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const connection = require('./database/database.js');
const session = require('express-session'); // contralo o sistema de login por sessoes

const categoriesController = require('./categories/CategoriesController.js');
const articlesController = require('./articles/ArticlesController.js');
const usersController = require('./users/UsersController.js');

const Article = require('./articles/Articles.js');
const Category = require('./categories/Category.js');
const User = require('./users/User.js');
// const { use } = require('./categories/CategoriesController.js');


//view engine (EJS)------------
app.set('view engine','ejs');

//bodyparser------------
app.use(bodyparser.urlencoded({extended: false})); // converter do html para o js
app.use(bodyparser.json()); // aceitar dados json

//Session
app.use(session({
    secret: "ASDNASKDNCAY8VCHAJSDNAU",
    cookie: { maxAge: 30000000} // maxge e o tempo maximo logado(lembrando q esta em milisegundo)
}))


//conexao com o banco------------
connection.authenticate().then(function(){
        console.log('Conexao com bd feita')
    }).catch(function(error){
        console.log(error)
    });

//Arquivos Estaticos------------
app.use(express.static('public')); //public e a pasta onde ficara os estaticos


//definindo rotas que serao usadas------------ 

app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);




// rota home onde mostra os artigos
app.get("/",function(req, res){
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4,

    }).then(function(articles){

        Category.findAll().then(function(categories){

            res.render('index.ejs',{articles: articles, categories: categories}); //enviando os artigos e as categorias para o frontend
        });
    });
});


//rota procura o slug do botao e joga pra pagina article.ejs
app.get('/:slug',function(req, res){
    var slug = req.params.slug;
    Article.findOne({
        where: {slug: slug}
    }).then(function(article){
        if(article != undefined){
            Category.findAll().then(function(categories){

                res.render('article.ejs',{article: article, categories: categories}); //enviando os artigos e as categorias para o frontend
            });

        }else{
            res.redirect("/")
        }
    }).catch(function(err){
        res.redirect("/")
    });
});


app.get("/category/:slug",function(req, res){
    var slug = req.params.slug;
    
    Category.findOne({
        where: {slug: slug},

        include: [{model: Article}] // join entre category e o article

    }).then(function(category) {
        if(category != undefined){
            
            Category.findAll().then(function(categories){

                res.render("index.ejs",{articles: category.articles, categories: categories}) //so e possivel graças ao join
            })

        }else{
            
            res.redirect("/")
            
        }    
    }).catch(function(err) {
        
        res.redirect("/")
    });
});

app.listen(8080,function(){
    console.log("servidor esta rodando normalmente");
});