const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const regcodeSchema = new Schema({code: {type: Long}, name: String, fb: String, created: Date, outdated: Boolean})
const regcodeModel = mongoose.model('regcode', regcodeSchema)
const accountSchema = new Schema({id:Number, name:String, fb:String, created: Date, username:String, vip:{type:Number, default:0}, password:String})
const accountModel = mongoose.model('account', accountSchema)

module.exports = {regcodeModel, accountModel}
