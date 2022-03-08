'use strict'
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:index')
let inventory = require('./modbus')
let {
	// array,
	bootstrap,
	serialize,
	search,
} = require('./configure')
module.exports = {
	
	commission: async function(req, res, next){
	  if(req.physical && req.physical.array && req.physical.array.length > 0){
		for (var i = 0; i < req.physical.array.length; i++) {
			let e = req.physical.array[i]
			log.info(e)
			res.array = []
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
					responses.ip = e.ip
					responses.port = e.port
					responses.subordinatorNumber = e.subordinatorNumber
					responses.functioncode = e.functioncode
					responses.register = e.register
					responses.quantity = e.quantity
					
					res.array.push(responses)
					
					next(responses)
				})
				.catch((error) => {
					next(error)
					log.error(error)
				})
		}
	  }
	  return
	},

	instantiate: function(req, res, next){
		res.array = []
		console.log(req.physicals.array, '=================================')
		if(req.physicals && req.physicals.array){
			for (let i = 0; i < req.physicals.array.length; i = i + 1) {
				let addr = req.physicals.array[i]
				
				req.space = search(addr.model)
				
				console.log(addr.model, req.space , '-------------------------------------------')

				for (let j = 0; j < req.space.length; j = j + 1) {
					let sample = req.space			
					let scramble = {
						ip: addr.ip,
						port: addr.port,
						subordinatorNumber: addr.subordinatorNumber,
						model: addr.model,

						protocol: req.physical.protocol,
						timeoutMillisecond: req.physical.timeoutMillisecond?req.physical.timeoutMillisecond:1000,

						register: sample.register,
						quantity: sample.quantity,
						category: sample.category,
						functioncode: sample.functioncode,
						

						flash: sample.flash? sample.flash: [0xef],
					}
					res.array.push(scramble)
				}
			}
		}
		// console.log(res)
		return
	  },
	  
	orchestrate: /**/async function(req, res, next) {
		let datasourceUnreachable = new Map()
		let datasourceOnline = new Map()

		let array = bootstrap()
		if(req){
			// let's assume req is array~
			log.trace(req)
			let temp = req.concat(array)
			array = temp
		}
		// 
		console.log(`${array.length} physical spaces loaded`)

		// query
		for (var i = 0; i < array.length; i++) {			
			let e = array[i]
			// log.info(e)
			if(e.ip && e.port && e.subordinatorNumber && e.functioncode && e.register && e.quantity && e.timeoutMillisecond){
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
						// raw data claim
						log.debug(responses)
	
						let buffer = responses.response._body._valuesAsBuffer
						let hexstr = buffer.toString('hex')
						hexstr['updatedAt'] = new Date(responses.metrics.receivedAt)
						log.debug(hexstr)
	
						let list = []
						for (let i = 0; i < responses.response._body._valuesAsBuffer.length /2; i += 2) {
							let focused = responses.response._body._valuesAsBuffer.slice(i * 2, i*2 + 2)
							let win = Buffer.from(focused)				
							list.push((responses.request._body._start + i) + ':' + win.readInt16BE(0) +  '(Int16),' + win.toString('hex') + '(HEX);')
						}
						res.write(`<p> ${list.length} :: ${e}</p>`)
						// datasourceOnline.set(e , responses)
						res.push(hexstr)
						next(responses)
					})
					.catch((error) => {
						// datasourceUnreachable.set(e, error)
						log.error(error)
					})

			} else {
				throw new Error(`missing parameters: ${__filename}`)
			}
		}

		// serialize to disk
		serialize(datasourceOnline)
		log.infor(datasourceOnline)

		// alarm
		log.warn(datasourceUnreachable)

		// all further work will only deal with the deserialized json object
		// res.end()
		return
	},

	updatePersistFile: function(){
		let arr = []
		for (var addrPair of datasourceOnline) {
			arr.push(addrPair[0])
			log.debug(`--> ${addrPair[1]}`)
		}
		serialize(arr)
	},
	// mapGood: datasourceOnline, 
	// mapFailed: datasourceUnreachable,
}
