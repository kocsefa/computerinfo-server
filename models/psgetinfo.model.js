const mongoose = require('mongoose')
const config = require('./../config')
const Schema = mongoose.Schema
const ReleaseInfo = require('./releaseinfo.model')

mongoose.connect(config.connectionString, { useNewUrlParser: true })

const psGetInfoSchema = new Schema({
    ComputerName: String, 
    SerialNumber: String, 
    Model: String, 
    Manufacturer: String, 
    InstallDate: String, 
    UserName: String,
    OS: String, 
    OSVersion: String, 
    Status: String, 
    ConnectionTime: String, 
    PcConnectTime: String, 
    TCPInfo: [{ IPv4: String , IPv6: String, MAC: String }]
})

const psGetInfoModel = mongoose.model('ComputerInfo',psGetInfoSchema,'computer_info')

module.exports = psGetInfoModel