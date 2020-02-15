const psGetInfo = require('../models/psgetinfo.model')
const releaseInfo = require('../models/releaseinfo.model')
const modelInfo = require('../models/modelinfo.model')
const { IPV4_REGEX, IPV6_REGEX, MAC_REGEX } = require('../constants')
module.exports = {

    submit: async function (req, res, next) {
        let { info } = req.query
        if (!info) {
            return res.render('error', { message: '400', error: { status: 'Bad Request' } })
        }
        let d = new Date()
        datestring = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + ' ' +
            ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2)
        let json = JSON.parse(info)
        let TCPInfo = json.TCPInfo.split(" ")
        let i4 = 0
        let i6 = 0
        let mac = 0

        let TCPInfoList = []
        for (var i = 0; i < TCPInfo.length; i++) {
            if (TCPInfo[i].match(IPV4_REGEX)) {
                TCPInfoList[i4] = TCPInfoList[i4] || {}
                TCPInfoList[i4].IPv4 = TCPInfo[i]
                i4++
            } else if (TCPInfo[i].match(MAC_REGEX)) {
                TCPInfoList[mac] = TCPInfoList[mac] || {}
                TCPInfoList[mac].MAC = TCPInfo[i]
                mac++
            } else if (TCPInfo[i].match(IPV6_REGEX)) {
                TCPInfoList[i6] = TCPInfoList[i6] || {}
                TCPInfoList[i6].IPv6 = TCPInfo[i]
                i6++
            }
        }
        //Powershell düzenlemesi gerekiyor alttaki iki satır için gelen tarihin yeri değiştiriliyor ilave alan ekleniyor
        json.PcConnectTime = json.ConnectionTime
        json.ConnectionTime = datestring
        json.TCPInfo = TCPInfoList
        let dataobject = await psGetInfo.findOne({ ComputerName: json.ComputerName })
        if (dataobject === null) {
            await psGetInfo.insertMany([json])
            req.actionType = 'insert'
        } else {
            await psGetInfo.updateOne({ ComputerName: json.ComputerName }, { $set: json }, (err, success) => {
                if (err) {
                    console.error(err)
                }
            })
            req.actionType = 'update'
        }
        req.lastDoc = await psGetInfo.findOne({ ComputerName: json.ComputerName })

        const versions = await releaseInfo.find({})
        const version = versions.find(
            v => req.lastDoc.OSVersion.indexOf(v.buildNumber) !== -1
        )
        if (version) { req.lastDoc.OSVersion = version.version }

        const models = await modelInfo.find({})
        const model = models.find(
            v => req.lastDoc.Model.toUpperCase().indexOf(v.code) !== -1
        )
        if (model) { req.lastDoc.Model = model.name }
        req.lastDoc.OS = req.lastDoc.OS.replace('Microsoft Windows ', 'Win').replace('Professional', 'Pro').replace('Standard', 'Std')
        next()
    }
}
