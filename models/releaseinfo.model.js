const mongoose = require('mongoose')
const config = require('../config')
const Schema = mongoose.Schema

mongoose.connect(config.connectionString, { useNewUrlParser: true })

const releaseInfoSchema = new Schema({
    buildNumber: String,
    version: String
})

const releaseInfoModel = mongoose.model('releaseInfo', releaseInfoSchema, 'release_info')

module.exports = releaseInfoModel