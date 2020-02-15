var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const socketIO = require('socket.io')

const psGetInfo = require('./models/psgetinfo.model')
const releaseInfo = require('./models/releaseinfo.model')
const modelInfo = require('./models/modelinfo.model')
const ipAccess = require('./models/ipaccess.model')

var app = express()

const io = socketIO()
app.io = io

var routes = require('./routes/index')(io)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

io.on('connection', async socket => {
  const IPraw = socket.handshake.address
  let IP = IPraw.split(':')
  IP = IP[IP.length -1]
  const exists = await ipAccess.findOne({ ipAddress: IP })
  const rawData = await psGetInfo.find({})
  const versions = await releaseInfo.find({})
  const models = await modelInfo.find({})
  
  const data = rawData.map(d => {
  // OSVersion'ları daha anlaşılır hale getirir.
    const version = versions.find(
        v => d.OSVersion.indexOf(v.buildNumber) !== -1
    )
    if (version) { d.OSVersion = version.version }

  // Model'leri daha anlaşılır hale getirir.
    const model = models.find(
      v => d.Model.toUpperCase().indexOf(v.code) !== -1
    )
    if (model) { d.Model = model.name }
    d.OS = d.OS.replace('Microsoft Windows ', 'Win').replace('Professional', 'Pro').replace('Standard', 'Std')
    return d
  })

  const clients = io.engine.clientsCount
  if (!exists) { socket.disconnect() }
  else {
    socket.emit('init', { data })
    io.emit('active-clients', { clients })
  }

  socket.on('disconnect', () => {
    const clients = io.engine.clientsCount
    io.emit('active-clients', { clients })
  })
})

module.exports = app
