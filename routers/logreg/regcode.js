const express = require('express')
const router = express.Router()
const {PythonShell} = require('python-shell');
const fs = require('fs');
const {lim} = require('../../app.js')
const uti = require('../../modules/uti.js')

router.use(uti.notAuth)

const processCode = (opt,res,prced)=>{
    PythonShell.run('py/regcode.py', opt, (err, dat) => {
        if (err) throw err;
        if (dat) {
            res.send({status: "done", code: dat[1]})
            prced.today++;
            fs.writeFile('./secret/regcode.json', JSON.stringify(prced), {}, (err) => {
                if (err) throw err;
            })
        } else {
            res.send({
                status: "fail"
            })
        }
    })
}

router.get('/', (req, res) => {
    res.render('regcode')
}).post('/', (req, res) => {
    let fname = req.body.name;
    let fb = req.body.fb;

    let options = {
        args: [fname, fb, process.env.DB_URL]
    }
    fs.readFile('./secret/regcode.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let p_data = JSON.parse(data);
        let t = p_data.today;
        p_data.date = new Date(p_data.date);
        let time_now = new Date();
        if (time_now.getDate() - p_data.date.getDate() > 0 || time_now - p_data.date > 3600000*24) {
            p_data.date = time_now;
            p_data.today = 0;
            // Đổi trạng thái tất cả code sang outdate
            fs.writeFile('./secret/regcode.json', JSON.stringify(p_data), {}, (err) => {
                if (err) throw err;
            })
            processCode(options,res,p_data)
        } else {
            if (lim - t <= 0) {
                res.send({status: "nomore"})
            } else {
                processCode(options,res,p_data)
            }
        }
    })
})

module.exports = router;
