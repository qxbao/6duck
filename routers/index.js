const express = require('express')
const router = express.Router()
const regcode = require('../routers/logreg/regcode.js');

router.get('/',(req,res)=>{
  res.render("index")
})

router.use('/regcode', regcode)

module.exports = router;
