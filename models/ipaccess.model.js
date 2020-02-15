const mongoose = require('mongoose')
const config = require('../config')
const Schema = mongoose.Schema

mongoose.connect(config.connectionString, { useNewUrlParser: true })

const ipAccessSchema = new Schema({
    ipAddress: String
})

const ipAccessModel = mongoose.model('IpAccess',ipAccessSchema,'access_list')

module.exports = ipAccessModel