// Server
const express = require('express')
const app = express()
const port = 8080
const bodyParser = require("body-parser");
const passport = require('passport');
const io = require('socket.io')(app.listen(port,()=>{
    console.log("Server đang mở tại cổng "+port)
}));
const mongoose = require('mongoose');
const fs = require('fs');
const lim = 30
const session = require('express-session');
const MongoStore = require('connect-mongo');

io.on("connection", (socket)=>{
    socket.on("update regcode", (msg)=>{
        fs.readFile('./secret/regcode.json', 'utf-8', (err, data) => {
            if (err) throw err;
            let p_data = JSON.parse(data);
            p_data.date = new Date(p_data.date);
            let time_now = new Date();
            if (time_now.getDate() - p_data.date.getDate() > 0) {
                p_data.date = time_now;
                p_data.today = 0;
                // Đổi trạng thái tất cả code sang outdate
                fs.writeFile('./secret/regcode.json', JSON.stringify(p_data), {}, (err) => {
                    if (err) throw err;
                })
                io.sockets.emit("regcode updating", {remain:p_data.today, limit:lim})
            }else{
                io.sockets.emit("regcode updating", {remain:p_data.today, limit:lim})
            }
        })
    })
})

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
app.use(session(
    {secret: process.env.SECRET_CODE,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        })
    }
));
app.use(express.static(__dirname + '/public'));

// Setup
app.set('views', './templates');
app.set('view engine', 'pug');
app.set("view cache", false);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(passport.initialize());
app.use(passport.session());

// Router
const indexRouter = require('./routers/index.js');
app.use('/',indexRouter)

module.exports = {lim}
