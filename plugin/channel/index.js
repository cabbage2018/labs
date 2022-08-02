'use strict'
//const fs = require("fs")
//const path = require('path')
//const dispacher = require('../dispacher/index')
module.exports = {
	getParserDictionary: function () {
		let pool = new Map()
		const modbustcp = require('./daq/modbustcp/index')
		pool.set('modbustcp', modbustcp)
		//modbusTcp.register(dispacher)
		const opcua = require('./daq/opcua/index')
		pool.set('opcua', opcua)
		//opcUa.register(dispacher)
		const snap7 = require('./daq/snap7/index')
		pool.set('snap7', snap7)
		//snap7.register(dispacher)
		return pool
	}
}
