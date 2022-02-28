'use strict'
////must following the backbone 
var express = require('express');
var router = express.Router();
//let modbustcp = require('modbustcp')
//let opcua = require('opcua')
//let snap7 = require('snap7')
let startAt = new Date()
router.get('/', function (req, res, next) {
	const url = req.url
	res.send(`${url} started @${startAt}, until ${new Date().toISOString()}`);
});
module.exports = router;