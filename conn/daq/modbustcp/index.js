'use strict'
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:index')
let inventory = require('./modbus')
let {
	array,
	bootstrap,
	serialize,
} = require('./configure')
let datasourceUnreachable = new Map()
let datasourceOnline = new Map()
module.exports = {
	orchestrate: /*async*/ function (req, res, next) {

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
			log.info(e)

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

					// for (let i = 0; i < responses.response._body._valuesAsBuffer.length; i += 4) {
					// 	let win = Buffer.alloc(2 * 2)
					// 	buffer.copy(win, 0, i, i + 4)//!
					// 	// console.log(win.readFloatBE(0), '//', win, win.length)
					// }
					// res.write(`<p> ${buffer.length} :: ${e}</p>`)
					
					// e['online'] = true
					datasourceOnline.set(e , responses)
					res.push(hexstr)
					next(responses)
				})
				.catch((error) => {
					error['updatedAt'] = new Date()
					// list2.push(e)
					datasourceUnreachable.set(e, error)
					log.error(error)
				})
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
	mapGood: datasourceOnline, 
	mapFailed: datasourceUnreachable,
}

// function response() {
// 	let typeMap = listType(__dirname)
// 	let premiseMap = new Map()
// 	for (var x of typeMap) {
// 		log.trace(`${x[0]}->${x[1]}`)
		
// 		var files1 = fs.readdirSync(x[1], { encoding: 'utf-8' })
// 		for (var i = 0; i < files1.length; i++) {
// 			var reg = new RegExp(/response/gi)
// 			var match = reg.exec(files1[i])
// 			if (match) {
// 				let fullpath = path.join(x[1], files1[i])	
// 				if(fs.existsSync(fullpath)){
// 					let jsonObj = JSON.parse(fs.readFileSync(fullpath))
// 					premiseMap.set(x[0], jsonObj)	
// 				}
// 				console.log(`${files2[j]} space json for ${path2}`)
// 				break;
// 			}	
// 		}
// 	}
// 	console.log(`${premiseMap.size} models found under ${__dirname}`)
// 	return premiseMap
// }