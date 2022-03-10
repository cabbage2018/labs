'use strict'
let path = require('path')
let fs = require('fs')
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:configure')

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

function load() {

}
function save() {

}

/*
	there are two kinds of space->>
	named or structed:
		We have worked on that one like 3WL 3VA2, 7SJ686 etc.,
*/
function search(modelName) {
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
	search,
}
