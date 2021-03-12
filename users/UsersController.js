const express = require('express');
const router = express.Router();
const User = require("./User.js");
const bcrypt = require('bcryptjs'); // criptogra a senha
// const { UniqueConstraintError } = require('sequelize/types');

router.get("/admin/users", function(req, res){
    
    User.findAll().then(function(users){

        res.render('admin/users/index.ejs',{users: users})
    })


})

router.get("/admin/users/create", function(req, res){
    res.render("admin/users/create.ejs");
})

router.post("/users/create",function(req, res){
    var email = req.body.email;
    var password= req.body.password;

    //verificando se o email esta cadastrado
    User.findOne({where:{email: email}}).then(function(user){
         if(user == undefined){
            
             
             var salt = bcrypt.genSaltSync(10); // é um tempero para aumentar a segurança do hash
             var hash = bcrypt.hashSync(password, salt);
             
             //salvando no bd
             User.create({         
                 email: email, 
                 password: hash
                }).then(function(){
                    res.redirect("/");
                    
                }).catch(function(err) {
                    
                    res.redirect("/");
                })
               
                
            }else{
               res.redirect('/admin/users/create'); 
            }
    })
                
})

router.get("/login", function(req, res){
    res.render("admin/users/login")
});


router.post("/authenticate", function(req, res){

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(function(user){
        if(user != undefined){//se existe um usuario com esse email
            //validando senha

            var correct = bcrypt.compareSync(password, user.password); // vai comparar se a senha coloca agora bate com a hash do bd
            if(correct){

                req.session.user = {
                    id: user.id,
                    email: user.email,
                }

                res.redirect("/admin/articles");

            }else{

                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }

        }).catch(function(err) {
            
            res.redirect("/login");
        
    })
});

router.get("/logout",function(req, res){

    req.session.user = undefined;
    res.redirect("/")
})

module.exports= router;
            