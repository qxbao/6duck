const express = require('express')
const router = express.Router()
const {PythonShell} = require('python-shell');
const fs = require('fs');
const models = require("../../modules/models.js")
const bcrypt = require('bcrypt');
const uti = require('../../modules/uti.js')
router.use(uti.notAuth)

router.get('/', (req,res)=>{
    reg = req.query.code;
    res.render('register',{code:reg})
}).post('/', async(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let regcode = req.body.regcode;
    if(regcode.match(/^(\d){10}$/)){
        regcode = parseInt(req.body.regcode);
        await models.regcodeModel.findOne({code:regcode},async(err,reg)=>{
            if (err) throw err;
            if(reg){
                let time_now = new Date();
                if(time_now-reg.created < 3600000*24){
                    let pwdtest = password.length >= 8;
                    let usrtest = username.match(/^([A-Za-z0-9]+(.?[A-Za-z0-9]+)*){6,20}$/)
                    if(pwdtest && usrtest){
                        await models.accountModel.findOne({username:username}).exec(async(err,data)=>{
                            if(data){
                                res.send({status:"username"})
                            }else{
                                await models.accountModel.findOne({}).sort("-id").exec(async(err,data)=>{
                                    let idnow;
                                    if(data){
                                        idnow = data['id'] + 1
                                    }else{
                                        idnow = 1
                                    }
                                    let hashedpwd = bcrypt.hashSync(password, 10);
                                    models.accountModel.create({id:idnow, username:username, name:reg.name, fb:reg.fb, created: new Date(), vip:0,password:hashedpwd},(err)=>{
                                        if (err) throw err;
                                        res.send({status:"success", username:username})
                                        models.regcodeModel.findOneAndDelete({code:reg.code},(err)=>{
                                            if (err) throw err;
                                        })
                                    })
                                })
                            }
                        })
                    }else{
                        res.send({status:"notmatch",des:null})
                    }
                }else{
                    res.send({status:"regcode", des:"outdated"})
                }
            }else{
                res.send({status:"regcode", des:"notfound"})
            }
        }).clone()
    }else{
        res.send({status:"regcode", des:"invalidformat"})
    }
})

module.exports = router;
