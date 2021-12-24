const express = require('express')
const router = express.Router()
const models = require("../../modules/models.js")
const uti = require("../../modules/uti.js")
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require("passport-local")

router.use(uti.notAuth)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    models.accountModel.findOne({
        id: id
    }, function(err, user) {
        done(err, user);
    });
});

passport.use('local', new LocalStrategy((username, password, done) => {
    models.accountModel.findOne({
        username: username
    }, (err, data) => {
        if (err) {
            return done(err);
        }
        if (data) {
            let foundPwd = data.password;
            let checkPass = bcrypt.compareSync(password, foundPwd);
            if (!checkPass) {
                return done(null, false)
            }
        } else {
            return done(null, false)
        }
        return done(null, data)
    })
}))

router.get('/', (req, res) => {
    username = req.query.username;
    res.render('login', {
        username: username
    })
}).post('/check', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    models.accountModel.findOne({
        username: username
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            let foundPwd = data.password;
            let checkPass = bcrypt.compareSync(password, foundPwd);
            if (checkPass) {
                res.send({
                    status: "success"
                })
            } else {
                res.send({
                    status: "nomatch"
                })
            }
        } else {
            res.send({
                status: "notfound"
            })
        }
    })
}).post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

module.exports = router;
