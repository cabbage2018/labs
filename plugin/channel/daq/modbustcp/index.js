'use strict'
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:index')
let modbus = require('./modbus')
let path = require('path')
let fs = require('fs')

function removeSymbol(inputString) {
	log.debug(inputString)
	let purified = inputString.replace(/[-_:./\\]/gi, "")
	log.debug(purified)
	return purified
}

function deserialize(jsonFilepath) {
	let array = []
	if (fs.existsSync(jsonFilepath)) {
		console.log(`You discovering modbus physical channels in: ${__dirname}`)

		let o = JSON.parse(fs.readFileSync(jsonFilepath))
		for (let i = 0; i < o.length; i = i + 1) {
			array.push(o[i])
		}
	}
	return array
}

function serialize(jsonArray) {
	fs.writeFileSync(path.join(__dirname, './remote.json'), JSON.stringify(jsonArray))
}
/* 
	modeled physical device
*/
function prepareModel(rootdir) {
	var dirs = fs.readdirSync(rootdir, { encoding: 'utf-8' })
	let a = new Map()
	for (var i = 0; i < dirs.length; i++) {
		let path2 = path.join(rootdir, dirs[i])
		var fileStat = fs.statSync(path2)
		if (fileStat.isDirectory()) {
			let serviceProvider = {}
			serviceProvider.layout = layout(path2)

			if (serviceProvider.layout) {
				serviceProvider.space = space(path2)
				a.set(dirs[i].toUpperCase(), serviceProvider)
			}

			log.debug(dirs[i] + '->' + path2)
		}
	}
	return a
}

function displayProperties(jsonObj) {
	for (var val in jsonObj) {
		log.debug(val + ": " + jsonObj[val])
	}
	return;
}
function displayMap() {
	let array = []
	for (var x of mapObj) {
		var jsonObj = {}
		log.debug(x[0] + '=' + x[1])
		jsonObj[x[0]] = x[1]
		array.push(jsonObj)
	}
	let jsonString = JSON.stringify(jsonArray)
	console.log(jsonString)

}
function troubleshootModel() {
	let mapObj = prepareModel(__dirname)
	const list = []
	for (var val in mapObj) {
		list.push({
			'key': val[0],
			'val': val[1]
		})
	}
	return list
}
/*
	there are two kinds of space->>
	named or structed:
		We have worked on that one like 3WL 3VA2, 7SJ686 etc.,
*/
function lookup(modelName) {
	let knownModels = new Map()
	knownModels = prepareModel(__dirname)
	if (knownModels.get(modelName.toUpperCase())) {
		return knownModels.get(modelName.toUpperCase())
	}
	return undefined
}

function layout(dir) {
	let jouer = undefined
	var files1 = fs.readdirSync(dir, { encoding: 'utf-8' })
	for (var i = 0; i < files1.length; i++) {
		var reg = new RegExp(/layout/gi)
		var match = reg.exec(files1[i])
		let fullpath = path.join(dir, files1[i])
		let stat = fs.statSync(fullpath)
		if (!stat.isDirectory() && match) {
			jouer = JSON.parse(fs.readFileSync(fullpath))
			console.log(`${files1[i]} space json for ${dir}`)
			break;
		}
	}
	return jouer
}

function space(dir) {
	let jouer = undefined
	var files1 = fs.readdirSync(dir, { encoding: 'utf-8' })
	for (var i = 0; i < files1.length; i++) {
		var reg = new RegExp(/space/gi)
		var match = reg.exec(files1[i])
		let fullpath = path.join(dir, files1[i])
		let stat = fs.statSync(fullpath)
		if (!stat.isDirectory() && match) {
			jouer = JSON.parse(fs.readFileSync(fullpath))
			console.log(`${files1[i]} space json for ${dir}`)
			break;
		}
	}
	return jouer
}

function bootstrap() {
	let knownModels = new Map()
	knownModels = prepareModel(__dirname)
	let addr = deserialize(path.join(__dirname, './remote.json'))
	let arr = []
	for (let i = 0; i < addr.length; i = i + 1) {
		let sample = addr[i]
		// console.log(`${addr.length}, ${i}`)
		let scramble = undefined
		if (sample && sample.model && knownModels.get(sample.model.toUpperCase())) {
			let model1 = knownModels.get(sample.model.toUpperCase())
			for (let j = 0; j < model1.array.length; j = j + 1) {
				let space = model1.array[i]
				scramble = {
					ip: sample.ip,
					port: sample.port,
					subordinatorNumber: sample.subordinatorNumber,
					model: sample.model,
					protocol: sample.protocol,//channel
					// online: sample.online,
					timeoutMillisecond: sample.timeoutMillisecond,

					register: space.register,
					quantity: space.quantity,
					category: space.category,
					functioncode: space.functioncode,
					flash: space.flash,
				}
			}
		} else {
			scramble = {
				description: "Uniform-NO-model device, SI China MAC Connectivity Labs@SLC",
				ip: sample.ip,
				port: sample.port,
				subordinatorNumber: sample.subordinatorNumber,
				// model: sample.model,
				protocol: sample.protocol,//channel
				// online: sample.online,
				timeoutMillisecond: sample.timeoutMillisecond,
				register: sample.register,
				quantity: sample.quantity,
				functioncode: space.functioncode,
				flash: [0x0, 0xfe]
			}
		}
		arr.push(scramble)
	}
	log.debug(arr)
	return arr
}

module.exports = {
	bootstrap,
	serialize,
	lookup,
}
let {
	// array,
	bootstrap,
	serialize,
	lookup,
} = require('./configure')
function load() {

}
function save() { }

module.exports = {

	commission: async function (req, res, next) {
		if (res.physicals && res.physicals.length > 0) {
			for (var i = 0; i < res.physicals.length; i++) {
				let e = res.physicals[i]
				log.info(e)

				res.resolved = []
				await modbus.acquire(
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
						res.resolved.push(responses)
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

	instantiate: function (req, res, next) {
		if (req.candidates) {
			for (let i = 0; i < req.candidates.length; i = i + 1) {
				let addr = req.candidates[i]
				req.serviceProvider = lookup(addr.model)
				if (req.serviceProvider.space && req.serviceProvider.layout) {
					for (let j = 0; j < req.serviceProvider.space.length; j = j + 1) {
						let sample = req.serviceProvider.space[j]
						let scramble = {
							ip: addr.ip,
							port: addr.port,
							subordinatorNumber: addr.subordinatorNumber,
							model: addr.model,

							// protocol: req.physical.protocol,
							timeoutMillisecond: addr.timeoutMillisecond ? addr.timeoutMillisecond : 1000,

							register: sample.register,
							quantity: sample.quantity,
							category: sample.category,
							functioncode: sample.functioncode,


							flash: sample.flash ? sample.flash : [0xef],
						}
						res.physicals.push(scramble)
					}
				}
			}
		}
		console.log(res.physicals)
		return
	},

	orchestrate: /**/async function (req, res, next) {
		let datasourceUnreachable = new Map()
		let datasourceOnline = new Map()

		let array = bootstrap()
		if (req) {
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
			if (e.ip && e.port && e.subordinatorNumber && e.functioncode && e.register && e.quantity && e.timeoutMillisecond) {
				await modbus.acquire(
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
						for (let i = 0; i < responses.response._body._valuesAsBuffer.length / 2; i += 2) {
							let focused = responses.response._body._valuesAsBuffer.slice(i * 2, i * 2 + 2)
							let win = Buffer.from(focused)
							list.push((responses.request._body._start + i) + ':' + win.readInt16BE(0) + '(Int16),' + win.toString('hex') + '(HEX);')
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

	updatePersistFile: function () {
		let arr = []
		for (var addrPair of datasourceOnline) {
			arr.push(addrPair[0])
			log.debug(`--> ${addrPair[1]}`)
		}
		serialize(arr)
	},
	// mapGood: datasourceOnline, 
	// mapFailed: datasourceUnreachable,
	acquire(addr) {
		await modbus.acquire(
			addr.ip,
			addr.port,
			addr.subordinatorNumber,
			addr.functioncode,
			addr.register,
			addr.quantity,
			addr.timeoutMillisecond,
			addr.flash)
			.then((responses) => {
				responses.addr = addr
				if (addr.model && inventory[addr.model]) {
					//decode

				}
			})
			.catch((error) => {
				next(error)
				log.error(error)
			})
	},
	//bulkacq(addrs) { },
}



/*
	layout
		knowntype
		layout->
			knowntype
			layout
		
	knowntype
		double
		float
		int/long
			enum
		bits
			boffset
			blength
			enum
		ascii/string
		hexstring

*/
function gothrough(structArray, rawResponse) {

	let results = []

	for (let i = 0; i < structArray.array.length; i = i + 1) {
		let sample = structArray.array[i]

		if (sample.start >= rawResponse.start && sample.stop <= rawResponse.stop) {
			let _byteStart = rawResponse.request._body._start - sample.start
			_byteStart *= 2
			let _byteEndNext = rawResponse.request._body._start + rawResponse.response._body._valuesAsBuffer.length //?
			_byteEndNext *= 2
			_byteEndNext += 1

			let focused = buffer.slice(_byteStart, _byteEndNext)
			let cloned = Buffer.from(focused)

			let targetType = sample.dataType.toUpperCase()

			switch (targetType) {
				case "LONG":
				case "INT":
				case "ULONG":
				case "UINT":
				case "CHAR":
				case "UCHAR":
				case "FLOAT":
				case "DOUBLE":
				case "BITS":

					/* first expand unknown type until it's known by this machine*/
					results.push(handleKnownType(sample, cloned))
					break;

				default:

					/* then tyr parse all left decodable nodes*/
					handleUnknownType(structArray, sample, cloned, results)
					break;
			}
		}

	}
}

function handleUnknownType(structArray, sample, cloned, results) {
	if (structArray.layout.get(sample.dataType.toUpperCase())) {
		let finalLayout = structArray.layout.get(sample.dataType.toUpperCase())

		for (let f of finalLayout) {
			if (f[1].dataType.toUpperCase().indexOf()) {

				let segmented = cloned.splice(_start, _stopNext)
				let u = handleKnownType(sample, segmented)
				results.push(u)
			}
		}

	}
}

// offset and bits both less than 32 - that is a LONG as maximum 
function handleSignal(decodeItem, buf, result) {
	if (decodeItem.bigOffset + decodeItem.bitCounts > 31) {
		return
	}
	let interim = buf.readUInt8(0)
	let _bytes = buf.length
	switch (_bytes) {
		case 1:
			interim = buf.readUInt8(0)
			break;

		case 2:
			interim = buf.readUInt16BE(0)
			break;

		case 4:
			interim = buf.readUInt32BE(0)
			break;

		default:
			///3?
			break;
	}
	let binstr = interim.toString(2)
	const s = ("00000000000000000000000000000000" + binstr)///32bit padding
	console.log(s)
	let padding = s.substr(-32, 32)//16 bit position
	console.log(padding)
	padding = s.substr(0 - (32 - _bitOffset), _bitCounts)/// -1 to -32 as start position! a gauche
	console.log(padding)
}

function handleKnownType(sampleItem, buf) {
	let result = {
		start: sampleItem.start,
		stop: sampleItem.start + sampleItem.quantity,
		dataType: sampleItem.dataType,
		registers: buf,
		unit: sampleItem.unit,
		scale: sampleItem.scale,
	}

	if (sampleItem.bitOffset && sampleItem.bitCounts) {
		result.bitOffset = sampleItem.bitOffset
		result.bitCounts = sampleItem.bitCounts
	}

	let refinedDataType = sampleItem.dataType.toUpperCase().replace(/[ ,.:/\\]/gi, "")
	switch (refinedDataType) {
		case "LONGLONG":
			result._value = buf.readBigUInt64BE(0)
			break;

		case "LONG":
			result._value = buf.readInt32BE(0)
			break;

		case "INT":
			result._value = buf.readInt16BE(0)
			break;

		case "ULONG":
			result._value = buf.readUInt32BE(0)
			break;

		case "UINT":
			result._value = buf.readInt16BE(0)
			break;

		case "CHAR":
			result._value = buf.readInt8BE(0)
			break;

		case "UCHAR":
			result._value = buf.readUInt8BE(0)
			break;

		///float, as described in IEEE 754 STD.,

		case "FLOAT":
			result._value = buf.readFloatBE(0);
			break;

		case "DOUBLE":
			result._value = buf.readDoubleBE(0);
			break;

		/// boundary check
		case "BITS":
			handleSignal(sampleItem, buf, result)
			break;

		default:
			result._qualityCode = 0x8000e771
			console.log(buf.toString()) //
			throw new Error('Undefined decode type' + __filename)
			break;
	}

	//function handleEnum() {}

	if (result._value && typeof (result._value == 'number') && sampleItem.enumExplain) {
		if (sampleItem.enumExplain.get('_enumKey:' + result._value)) {
			result._enumValue = sampleItem.enumExplain.get('_enumKey:' + result._value)
		} else {
			result._enumValue = 'Undefined Signal'
		}
	}
	return result
}

module.exports = {
	gothrough: gothrough
}

/*
	model:  there had been 10 times longer code than this page,
	but this page is the proper one which servers
	that purpose and minimalized the effort!

	the effort of reading i mean but not writing
	along with the continuous writing action
	some clues got clearer and clearer

	some code reduced and reduced but works still
	some redundandency removed and get better understood

	some uncessary information aborted
	most revealing part is the data structure i used to describe the layout
	have settled and changed a lot, finally they become this.

	there seems 2 layer explainer for decode a page
	- 1st layer mixed with known type and unknown type which called format
	- 2nd layer are known types each

	format is a group of known types like double, int, string and bits

	bits actually can be interpreted into a number like 0, 1, 1024, ...

	bits and int/long sometime servers as signal which means they convey some meaning after decoded into number

	looks like a enum lookup table, so a key is the decoded number while its value is the enum result like singal meaning

	i am keeping those records until i delete them some day

*/

// target is: make them readable String with Context
// measure(PQSinputoutput[kWh/C]) = 3909093.5678773
// status(tripconditionsonoffalarm) = 0x2490
// event('overload trip short circuits both detected') = 2021.03.24T21:38:56:277Z
// so there is only one table which was condensed with rules like measures, statuss, events, etc.,
/*
	Here support as long as 'LONG' at present, 64bit, 8 bytes, 16 hex digits like '6d 3f 2e 7b f0'
	subInteger means from bit offset to bit length value
	for example, bit offset = 0 and big length =32 means whole INT data type
							 bit offset = [0::31] and bit length = 1 means one single bit position
							 one bit value can be translated into boolean like true or false(syntax with semantic)
			  
				datapoint.buffer = Buffer.from(rawdataObj.buffer);
				datapoint.start = (realStart) * / *sizeof(int) / * / 2;
				datapoint.counts = segment.registers * / * sizeof(int) / * / 2;
				datapoint.qualityCode = "0";
				datapoint.value = Number.MIN_VALUE;//NaN;
				datapoint.typeIndicator = "STRING";
 
				-->>
				datapoint.bitstart = 0..31;
				datapoint.bitcounts = 1..32;
  
	***
	to flexibly handle any cases in work, after consideration I adopted the own way of parse INT/LONG
	that is 'shift' and 'add'
	not the original designed Buffer function (readInt32BE...) BE guess mean Big Endian
  
	now this way I can read 1 word INT from some strange device like Siemens SoftStarter
 
	at first this piece code cannot process the 2 butes INT and the above readInt32BE gave exception
	after check the tracer message on screen I found this issue was caused by Buffer's function
	so when facing bytesArray = [0x01, 0xea], this could be viewed as byte array of word
	I simply move the BE to left: please remember the left most byte owns highest order
	intValue = 0x01 << 0x8 : move the most significant byte to left, that is to implement the BE means
	intValue = 0x01 << 0x8 + 0xea: get the full length value 
 
	actually thus this piece of new code could handle any bytes array until 8 - 64bits LONG for most computer 
*/
