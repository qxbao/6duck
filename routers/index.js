const express = require('express')
const router = express.Router()
const regcode = require('../routers/logreg/regcode.js');
const register = require('../routers/logreg/register.js');
const login = require('../routers/logreg/login.js');

router.get('/',(req,res,next)=>{
    if(req.isAuthenticated()){
        res.render("index")
    }else{
        next()
    }
},(req,res)=>{
    res.render("index")
})

router.use('/regcode', regcode)
router.use('/register', register)
router.use('/login', login)
router.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;
