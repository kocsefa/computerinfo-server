const ipAccess = require('./../models/ipaccess.model')
module.exports = async (req, res, next) => {
	console.log(datestring)
	const IPraw = req.headers['x-real-ip'] || req.connection.remoteAddress
	let IP = IPraw.split(':')
	IP = IP[IP.length - 1]
	const exists = await ipAccess.findOne({ ipAddress: IP })
	if (exists) return next()
	
	return res.render('error', { message: '401', error: { status: 'Unauthorized' } })
}
