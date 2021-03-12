const express = require('express');
const router = express.Router(); //possibilita criação de rotas sem usar o app.
const CategoryModel = require("./Category.js");
const slugify = require('slugify'); // remove os espaços da string


//Rota para adicionar nova categorias
router.get("/admin/categories/new", function(req, res){
    res.render('../views/admin/categories/new.ejs');
}) 

//so salva as informaçoes
router.post("/categories/save",function(req, res){
    var title = req.body.title1;
        if(title != undefined){

            //salvando no bd
            CategoryModel.create({
                //title bd: <- title(var)
                title: title, 
                slug: slugify(title), //slug e uma biblioteca
            }).then(function(){
                res.redirect("/admin/categories")
            });

        }else{
            res.redirect("/admin/categories/new")
        }
});

//rota com a pagina principal da categoria
router.get("/admin/categories",function(req, res){

    //findall = select como é all é *
    CategoryModel.findAll().then(function(categories){ 

        res.render('admin/categories/index.ejs',{categories: categories});
    });   
});

//Rota com  a pagina para deletar
router.post("/admin/categories/delete", function(req, res){
    var id = req.body.id1;
    if(id != undefined){

        if(!isNaN(id)){ //isNaN = verifica se é um valor numerico
            
            CategoryModel.destroy({
                //id (bd) = id(variavel acima)
                    where:{id: id}

                }).then(function(){//depois de excluir ele redireciona 
                
                    res.redirect("/admin/categories");
                });

            }else {// se o id não for um valor numerico
            res.redirect("/admin/categories");
            }
        }else{ // se não for um numero
        res.redirect("/admin/categories");
        }
    });

    //rota para editar a categoria
router.get("/admin/categories/edit/:id",function(req,res){
     var id  = req.params.id;

     if(isNaN(id)){
         res.redirect("/admin/categories");
     }

    CategoryModel.findByPk(id).then(function(category){

        if(category != undefined){
            res.render("admin/categories/edit.ejs",{category: category});

        }else{
            res.redirect("/admin/categories");
        }
        
    }).catch(function(erro){
        
        res.redirect("/admin/categories");
    });
    
});


//Atulizando a ediçao
router.post("/admin/update", function(req, res){
    var id= req.body.id1;
    var tile = req.body.tile1;
    
    CategoryModel.update({title: title, slug: slugify(title)},{
        where:{id: id}
    }).then(function(){
        
        res.redirect("/admin/categories");
    });


});


module.exports = router;