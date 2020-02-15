const mongoose = require('mongoose')
const config = require('../config')
const Schema = mongoose.Schema

mongoose.connect(config.connectionString, { useNewUrlParser: true })

const modelInfoSchema = new Schema({
    code: String,
    name: String
})

const modelInfoModel = mongoose.model('modelInfo', modelInfoSchema, 'model_info')

module.exports = modelInfoModel