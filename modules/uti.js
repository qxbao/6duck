const notAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.redirect('/')
    }else{
        next()
    }
}

module.exports = {notAuth}
