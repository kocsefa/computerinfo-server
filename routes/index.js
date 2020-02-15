module.exports = io => {
  var express = require('express')
  const psGetInfo = require('./../models/psgetinfo.model')
  const authentication = require('../middlewares/authentication')
  const submit = require('../helpers/computerInfo').submit

  var router = express.Router()
  // router.get('/', (req, res, next) => { res.render('index') })

  router.get('/computerInfo', authentication, async (req, res, next) => res.json(await psGetInfo.find({})))

  router.get(
    '/submit',
    submit,
    (req, res, next) => {
      req.actionType && io.emit(req.actionType, { data: req.lastDoc })
      return res.send(true)
    }
  )

  return router
}
