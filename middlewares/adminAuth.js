//middleware esta entre a req e a res de uma rota 

function adminAuth(req, res, next) {

    if(req.session.user != undefined){ // se o usuario estiver logado
        next(); 
    }else{
        res.redirect("/login");
    }
}


module.exports = adminAuth;