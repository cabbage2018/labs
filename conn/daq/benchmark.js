'use strict'
let modbustcp = require("./modbustcp")
let opcua = require("./opcua")
// benchmark: only and if only the reason for creation of a software
// orchestrate with profile/performance purpose
module.exports = {
	benchmarkModbusTCP: async function () {
		setTimeout(async function () {
			let livre = {}
			livre.start = new Date()
			log.debug(`>>start: ${new Date()}`)
			livre.ts1 = new Date().getTime()
			let repeats = 1000
			repeats = (repeats < 0 || repeats > 10000) ? repeats : 1000
			for (let i = 0; i < repeats; i += 1) {
				for (let j = 0; j < remotes.length; j += 1) {
					let sample = remotes[j]
					await modbustcp.acquire(
						sample.ip, sample.port, sample.subordinatorNumber, sample.functioncode, sample.register, sample.quantity, sample.timeoutMillisecond, sample.flash)
				}
			}
			livre.end = new Date()
			log.debug(`<<stop: ${new Date()}`)
			livre.ts2 = new Date().getTime()

			livre.interval = livre.end.getTime() - livre.start.getTime()
			log.mark(`${repeats} acquisition has consumpted ${livre.interval} long time`)

			//statistics
			const ms = (livre.ts2 - livre.ts1) * 1.0 / (repeats + 1)
			log.info(`average consumption milliseconds= ${ms} observed`)

			/// with above we measured network quality
			return ms;
		}, 9000)
	},

	benchmarkModbusRTU: async function () {
		setTimeout(async function () {
			let livre = {}
			livre.start = new Date()
			log.debug(`>>start: ${new Date()}`)
			livre.ts1 = new Date().getTime()
			let repeats = 1000
			repeats = (repeats < 0 || repeats > 10000) ? repeats : 1000
			for (let i = 0; i < repeats; i += 1) {
				for (let j = 0; j < remotes.length; j += 1) {
					let sample = remotes[j]
					await
						modbus.acquire(assembledAddress)
							.then((resp) => {
								console.log(resp)
							})
							.catch((error) => {
								// assembledAddress.unreachable = new Date()
								// assembledAddress.badResponse = assembledAddress.badResponse ? assembledAddress.badResponse + 1 : 1
								assembledAddress.alert = error
								console.log(error)
							})
				}
			}
			livre.end = new Date()
			log.debug(`<<stop: ${new Date()}`)
			livre.ts2 = new Date().getTime()

			livre.interval = livre.end.getTime() - livre.start.getTime()
			log.mark(`${repeats} acquisition has consumpted ${livre.interval} long time`)

			//statistics
			const ms = (livre.ts2 - livre.ts1) * 1.0 / (repeats + 1)
			log.info(`average consumption milliseconds= ${ms} observed`)

			/// with above we measured network quality
			return ms;
		}, 19000)
	},


	benchmarkOpcua: async function () {
		setTimeout(async function () {
			let livre = {}
			livre.start = new Date()
			log.debug(`>>start: ${new Date()}`)
			livre.ts1 = new Date().getTime()
			let repeats = 1000
			repeats = (repeats < 0 || repeats > 10000) ? repeats : 1000
			for (let i = 0; i < repeats; i += 1) {
				for (let j = 0; j < remotes.length; j += 1) {
					let sample = remotes[j]
					await opcua.acquire(sample)
					.then((resp) => {
						console.log(resp)
					})
					.catch((error) => {
						console.log(error)
					})
				}
			}
			livre.end = new Date()
			log.debug(`<<stop: ${new Date()}`)
			livre.ts2 = new Date().getTime()

			livre.interval = livre.end.getTime() - livre.start.getTime()
			log.mark(`${repeats} acquisition has consumpted ${livre.interval} long time`)

			//statistics
			const ms = (livre.ts2 - livre.ts1) * 1.0 / (repeats + 1)
			log.info(`average consumption milliseconds= ${ms} observed`)

			/// with above we measured network quality
			return ms;
		}, 29000)
	},
}

function configure() {
	let projects = ['ccead', 'labs']
	let physicals = []
	for (var i = 0; i < projects.length; i++) {
		let proj = projects[i]
		let physical = processsubfolder(proj)
		let space = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./space.json")))
		let matrix = []//(sementix)
		for (var i = 0; i < physical.array.length; i++) {
			let physical1 = physical.array[i]
			for (var j = 0; j < space.array.length; j++) {
				let space2 = space.array[j]
				let item = {
					ip: physical1.ip,
					port: physical1.port,
					sub: physical1.subordinatorNumber,
					model: physical1.model,
					desc: physical1.desc,
					timeout: physical1.timeoutMillisecond,

					fc: space2.functioncode,
					register: space2.register,
					count: space2.quantity,
					signals: space2.signals,
					outputs: space2.flash
				}
				matrix.push(item)
			}
		}
		profilingDictionary.set(proj, matrix)
		physicals.push(matrix)
	}
	return physicals
}
let knownGood = []
let knowBad = []
async function access(s) {
	await modbustcp.acquire(s.ip, s.port, s.sub, s.fc, s.register, s.count, s.timeout, s.outputs)
		.then((response) => {
			let filenameAsString = `${response.request._body._start}_` +
				`${response.request._body._count}_` +
				`${response.request._body._fc}_` +
				// `${response.metrics.receivedAt.toISOString().replace(/[:./\\]/gi, "_")}`
				// /*.toLowerCase()*/
				fs.writeFileSync(filenameAsString + ".json", JSON.stringify(response), "utf8")
			knownGood.push(s)
			// profilingDictionary.set(`${internalSn}_${grid.register}_${grid.quantity}_${grid.functioncode}`, _response)
		})
		.catch((error) => {
			s.disabled = true
			knowBad.push(s)

			log.error(error)
		})
}

module.exports = {
	/* access device in a crazy way*/
	inventory: async function device(collection) {
		/* project by project*/
		collection = project.load()
		for (let i = 0; i < collection.array.length; i += 1) {
			let address = {}
			address.ip = address.array[i].ip
			address.port = address.array[i].port
			address.sub = address.array[i].sub
			address.fc = address.array[i].fc
			address.register = address.array[i].start
			address.count = address.array[i].quantity
			await modbustcp.acquire(address.ip,
				address.port,
				address.sub,
				address.fc,
				address.register,
				address.count,
				address.timeout,
				address.output)
				.then((resp) => {
					log.debug(resp)
					status.set(address, resp)
				})
				.catch((err) => {
					log.error(err)
				})
		}
	},
	/* monitor status profile*/
	display: function () {
		let entry = {}
		for (let x of status) {
			entry.k = x[0]
			entry.v = x[1]
		}
		log.debug(entry)
	}
}	  