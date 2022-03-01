'use strict'
let path = require('path')
let fs = require('fs')
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:configure')
let path1 = path.join(__dirname, './remote.json')
function commissioning(){}

/*
	there are two kinds of space->>
	named or structed:
		We have worked on that one like 3WL 3VA2, 7SJ686 etc.,
		
*/

function bootstrap() {
	let addr = fs.readFileSync(path1)
	console.log(`You discovering modbus physical channels: ${addr}`)	
	let collector = []
	for (let i = 0; i < addr.length; i = i + 1) {
		let sample = addr[i]	
		console.log(`${addr.length}, ${i}`)
		let knownModels = build()
		let modelName = sample.model
		let scramble = undefined
		if(knownModels.get(modelName)){
			let model1 = knownModels.get(modelName)
			for (let j = 0; j < model1.array.length; j = j + 1) {
				let space = model1.array[i]
				scramble = {
					ip: sample.ip,
					port: sample.port,
					subordinatorNumber: sample.subordinatorNumber,
					model: sample.model,
					protocol: sample.protocol,//channel
					online: sample.online,
					timeoutMillisecond: sample.timeoutMillisecond,


					register: space.register,
					quantity: space.quantity,
					category: space.category,
					functioncode: space.functioncode,
					flash: space.flash,
				}
			}
		}else{
			scramble = {
				description: "Uniform-NO-model device, SI China MAC Connectivity Labs@SLC",
				ip: sample.ip,
				port: sample.port,
				subordinatorNumber: sample.subordinatorNumber,
				// model: sample.model,
				protocol: sample.protocol,//channel
				online: sample.online,
				timeoutMillisecond: sample.timeoutMillisecond,
				register: sample.register,
				quantity: sample.quantity,
				functioncode: space.functioncode,
			}
		}
		collector.push(scramble)
	}
	
	log.debug(collector)
	return collector
}

let array = []
let persistFilePath = path.join(__dirname, './spaces.json')

function deserialize (){
	if(fs.existsSync(persistFilePath)){
		let o = JSON.parse(fs.readFileSync(persistFilePath))
		for(let i = 0; i < o.length; i = i + 1){
			array.push(o[i])
		}
		array['existing'] = o.length
	} else{
		let r = loading(__dirname)
		for(let i = 0; i < r.length; i = i + 1){
			array.push(r[i])
		}
	}
	return
}

function serialize(json) {
	fs.writeFileSync(persistFilePath, JSON.stringify(json))
}

/* Minimum cycle in Node = 1ms and 50ms in Browser mightly */
function iterateSingleModel(pathDeviceRoot){

	// let path1 = path.join(__dirname, folder)
	let files1 = fs.readdirSync(pathDeviceRoot, { encoding: 'utf-8' })
	let collector = []
	for (var i = 0; i < files1.length; i++) {
		let path2 = path.join(path1, files1[i])
		var fileStat = fs.statSync(path2)
		if (fileStat.isDirectory()) {
			var files2 = fs.readdirSync(path2, { encoding: 'utf-8' })
			for (var j = 0; j < files2.length; j++) {
				console.log('located ', files2[j])
				if (!fs.statSync(path2).isDirectory && path.extname(files2[j]) === extname) {
					let model = {}
					model.index = files2[j]
					model.path = path2
					var reg = new RegExp('*space*', 'gi')
					var match = reg.exec(files2[j])
					if (null !== match) {
						model.space = path.join(path2, files[i])
						console.log(`${files2[j]} space json for ${path2}`)
					}
					model['channel'] = 'modbustcp'
					collector.push(model)
				}
			}
		}
	}
	console.log(`${collector.length} models found under ${folder}`)
	return collector
}

function listModel(){
	var files1 = fs.readdirSync(folder, { encoding: 'utf-8' })
	let a = new Map()
	for (var i = 0; i < files1.length; i++) {
		let path2 = path.join(folder, files1[i])
		var fileStat = fs.statSync(path2)
		
		if (fileStat.isDirectory()) {
			a.set(files1[i], path2)
			console.log(files1[i], path2)
		}
	}
	return a
}
/* 
	modeled physical device
*/


/* 
	raw physical device
		uniformed:
		don't care the structure but rather touch that asset for make sure it is network connected and online and accessible with desired protocol/channel(sometime one device even support several)
		uniform device that means
		NO model attached
		voila cela moi
*/
function removeSymbol(inputString){
	log.debug(inputString)
	let purified = inputString.replace(/[-_:./\\]/gi, "")
	log.debug(purified)
	return purified
}

function listRawDevice(fullpath){
	let jsonArray = JSON.parse(fs.readFileSync(fullpath))
	let matrix = listModel()

	for (let i = 0; i < jsonArray.length; i++) {
		let segment = jsonArray[i]
		log.debug(segment)

		let protocolAbbreviate = removeSymbol(segment.protocol)
		let protocolLowerCase = protocolAbbreviate.toLowerCase()
		log.debug(protocolLowerCase)

		let modelAbbreviate = removeSymbol(segment.model)
		let modelLowerCase = modelAbbreviate.toLowerCase()
		log.debug(modelLowerCase)

		if(matrix.get(modelLowerCase)){
			let designated = matrix.get(modelLowerCase)

		}

	}
}

module.exports = {
	array,
	deserialize, 
	serialize,
	bootstrap,

	physical: function() {
		let typeMap = listType(__dirname)
		let premiseMap = new Map()
		for (var x of typeMap) {
			log.trace(`${x[0]}->${x[1]}`)
			
			var files1 = fs.readdirSync(x[1], { encoding: 'utf-8' })
			for (var i = 0; i < files1.length; i++) {
				var reg = new RegExp(/physical/gi)
				var match = reg.exec(files1[i])
				if (match) {
					let fullpath = path.join(x[1], files1[i])	
					if(fs.existsSync(fullpath)){
						let jsonObj = JSON.parse(fs.readFileSync(fullpath))
						premiseMap.set(x[0], jsonObj)	
					}
					console.log(`${files2[j]} space json for ${path2}`)
					break;
				}	
			}
		}
		console.log(`${premiseMap.size} models found under ${__dirname}`)
		return premiseMap
	},
	space: function () {
		let typeMap = listType(__dirname)
		let premiseMap = new Map()
		for (var x of typeMap) {
			log.trace(`${x[0]}->${x[1]}`)
			
			var files1 = fs.readdirSync(x[1], { encoding: 'utf-8' })
			for (var i = 0; i < files1.length; i++) {
				var reg = new RegExp(/space/gi)
				var match = reg.exec(files1[i])
				if (match) {
					let fullpath = path.join(x[1], files1[i])	
					if(fs.existsSync(fullpath)){
						let jsonObj = JSON.parse(fs.readFileSync(fullpath))
						premiseMap.set(x[0], jsonObj)	
					}
					console.log(`${files2[j]} space json for ${path2}`)
					break;
				}	
			}
		}
		console.log(`${premiseMap.size} models found under ${__dirname}`)
		return premiseMap
	},
	layout: function () {
		let typeMap = listType(__dirname)
		let premiseMap = new Map()
		for (var x of typeMap) {
			log.trace(`${x[0]}->${x[1]}`)
			
			var files1 = fs.readdirSync(x[1], { encoding: 'utf-8' })
			for (var i = 0; i < files1.length; i++) {
				var reg = new RegExp(/layout/gi)
				var match = reg.exec(files1[i])
				if (match) {
					let fullpath = path.join(x[1], files1[i])	
					if(fs.existsSync(fullpath)){
						let jsonObj = JSON.parse(fs.readFileSync(fullpath))
						premiseMap.set(x[0], jsonObj)	
					}
					console.log(`${files2[j]} space json for ${path2}`)
					break;
				}	
			}
		}
		console.log(`${premiseMap.size} models found under ${__dirname}`)
		return premiseMap
	},
	response: function () {
		let typeMap = listType(__dirname)
		let premiseMap = new Map()
		for (var x of typeMap) {
			log.trace(`${x[0]}->${x[1]}`)
			
			var files1 = fs.readdirSync(x[1], { encoding: 'utf-8' })
			for (var i = 0; i < files1.length; i++) {
				var reg = new RegExp(/response/gi)
				var match = reg.exec(files1[i])
				if (match) {
					let fullpath = path.join(x[1], files1[i])	
					if(fs.existsSync(fullpath)){
						let jsonObj = JSON.parse(fs.readFileSync(fullpath))
						premiseMap.set(x[0], jsonObj)	
					}
					console.log(`${files2[j]} space json for ${path2}`)
					break;
				}	
			}
		}
		console.log(`${premiseMap.size} models found under ${__dirname}`)
		return premiseMap
	},
}

let arr = __dirname.split('\\')// Windows or Linux?
let lead = arr[arr.length - 1]