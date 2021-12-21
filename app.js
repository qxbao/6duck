// Server
const express = require('express')
const app = express()
const port = 8080
const bodyParser = require("body-parser");
const passport = require('passport');

console.clear()

// Framework & module
require('dotenv').config()
const db = require('mongoose')

// Database
db.connect(process.env.DB_URL)
db.connection.once('open', ()=>{
    console.log('=> Connect database thành công.')
}).on('error', function(err) {
  if (err) console.log(err)
});

// Middleware
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SECRET_CODE, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use((req,res,next)=>{
    next()
})

// Setup
app.set('views', './templates');
app.set('view engine', 'pug');
app.set("view cache", false);
app.use(bodyParser.urlencoded({ extended: false }));

// Router
const indexRouter = require('./routers/index.js');
app.use('/',indexRouter)

// Khởi tạo server
app.listen(8080, ()=>{
    console.log("=> Server đang chạy trên port",port)
})
