'use strict'
// var express = require('express');
// var router = express.Router();
// module.exports = router;
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:index')
let inventory = require('./modbus')
let {
	array,
	deserialize, 
	serialize,
	bootstrap,
	physical,
	space,
	layout,
	response,
} = require('./configure')
// router.get('/',)
module.exports = {
	abstract: async function (req, res, next) {

		log.trace(req)

		// deserialize()
		bootstrap()

		// orchestrate
		console.log(`${array.length} physical spaces loaded`)

		// query

		let list1 = []
		let list2 = []

		for (var i = 0; i < array.length; i++) {
			console.log(array[i])

			let e = array[i]
			await inventory.acquire(
				e.ip,
				e.port,
				e.subordinatorNumber,
				e.functioncode,
				e.register,
				e.quantity,
				e.timeoutMillisecond,
				e.flash)
				.then((responses) => {
					console.log(responses)
					let buffer = responses.response._body._valuesAsBuffer
					for (let i = 0; i < responses.response._body._valuesAsBuffer.length; i += 4) {
						let win = Buffer.alloc(2 * 2)
						buffer.copy(win, 0, i, i + 4)//!
						console.log(win.readFloatBE(0), '//', win, win.length)
					}
					res.write(`<p> ${buffer.length} :: ${e}</p>`)
					e['online'] = true
					list1.push(e)
				})
				.catch((error) => {
					e['online'] = false
					list2.push(e)
					console.log(error)
				})
		}

		// serialize to disk
		serialize(list1)
		log.infor(list1)

		// alarm
		log.error(list2)

		// all further work will only deal with the deserialized json object
		res.end()

		return
	}
}