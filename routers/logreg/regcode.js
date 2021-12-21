const express = require('express')
const router = express.Router()
const {PythonShell} = require('python-shell');

router.get('/', (req,res)=>{
  res.render('regcode',{namea:''})
}).post('/',(req,res)=>{
    let fname = req.body.name;
    let fb = req.body.fb;

    let options = {
        args:[fname, fb, process.env.DB_URL]
    }
    
    PythonShell.run('py/regcode.py',options,(err,data)=>{
        if(err) throw err;
        if(data){
            res.send({status:"done",code:data[1]})
        }else{
            res.send({status:"fail"})
        }
    })
})

module.exports = router;
