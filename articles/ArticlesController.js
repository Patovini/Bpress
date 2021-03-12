const express = require('express');
const router = express.Router(); //possibilita criação de rotas sem usar o app.
const Category = require('../categories/Category.js'); 
const Article = require('./Articles.js');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth.js');


//rota para pagina inicial dos articles
router.get("/admin/articles", adminAuth , function(req, res){

    Article.findAll({   
         //fazendo JOIN com a Category
        include: [{model: Category}] 
    }).then(function(articles){
        res.render('admin/articles/index.ejs',{articles: articles}) //{articles: articles} passa o articles para a view
    });
});


//rota Criação de artigos
router.get("/admin/articles/new", adminAuth, function(req, res){
    
    Category.findAll().then(function(categories){

        res.render('admin/articles/new.ejs',{categories: categories}); 
    })

});

//action para salvar os artigos novos
router.post("/articles/save", adminAuth ,function(req, res){
    var title = req.body.title1;
    var body = req.body.body1;
    var category = req.body.category1;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category, // FK do banco de dados
    }).then(function(){
        res.redirect('/admin/articles')
    })

})

//action  para deletar
router.post("/admin/articles/delete",  adminAuth , function(req, res){
    var id = req.body.id1;
    if(id != undefined){

        if(!isNaN(id)){ //isNaN = verifica se é um valor numerico
            
            Articles.destroy({
                //id (bd) = id(variavel acima)
                    where:{id: id}

                }).then(function(){//depois de excluir ele redireciona 
                
                    res.redirect("/admin/articles");
                });

            }else {// se o id não for um valor numerico
            res.redirect("/admin/articles");
            }
        }else{ // se não for um numero
        res.redirect("/admin/articles");
    }
});

//Rota para editar artigos

router.get("/admin/articles/edit/:id", adminAuth , function(req, res){
    var id = req.params.id;
    
    Article.findByPk(id).then(function(article){
        if(article != undefined){

            Category.findAll().then(function(categories){

                res.render("admin/articles/edit.ejs",{categories: categories, article: article})
            
            
            })

        }else{
            
            res.redirect("/admin/articles");
        }
        
    }).catch(function(err){
        
        res.redirect("/admin/articles");

    });

});


//action para salvar a edição

router.post("/articles/update",  adminAuth ,function(req, res){
    var id = req.body.id1;
    var title = req.body.title1
    var body = req.body.body1
    var category = req.body.category1;

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)},{

        where:{id:id}

    }).then(function(){
        res.redirect("/admin/articles");
    }).catch(function(err){
        res.redirect('/');
    });

});

//fazendo paginação

router.get("/articles/page/:num", function(req, res){

    var page = req.params.num;
    var offset = 0

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page)  -1) * 4;
    }
    Article.findAndCountAll({
        limit:4,
        offset: offset,
        // order: [['id', 'DESC']],

    }).then(function(articles){

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next =  true;
        }
        
        var result = {

            page: parseInt(page),
            next: next,
            articles: articles,
        }

        Category.findAll().then(function(categories){

            res.render("admin/articles/page.ejs",{result: result, categories: categories})
        });

    })

});



module.exports = router;