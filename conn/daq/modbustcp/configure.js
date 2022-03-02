'use strict'
let path = require('path')
let fs = require('fs')
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::modbustcp:configure')
// let persistFilePath = path.join(__dirname, './remote.json')
function removeSymbol(inputString){
	log.debug(inputString)
	let purified = inputString.replace(/[-_:./\\]/gi, "")
	log.debug(purified)
	return purified
}
function deserialize (jsonFilepath){
	let array = []
	if(fs.existsSync(jsonFilepath)){
		console.log(`You discovering modbus physical channels in: ${__dirname}`)	

		let o = JSON.parse(fs.readFileSync(jsonFilepath))
		for(let i = 0; i < o.length; i = i + 1){
			array.push(o[i])
		}
		// array['existing'] = o.length
	} /*else{
		let r = loading(__dirname)
		for(let i = 0; i < r.length; i = i + 1){
			array.push(r[i])
		}
	}*/
	return array
}
function serialize(jsonArray) {
	fs.writeFileSync(path.join(__dirname, './remote.json'), JSON.stringify(jsonArray))
}
function layout(modeldir) {
	let jouer = undefined
	var files1 = fs.readdirSync(modeldir, { encoding: 'utf-8' })
	for (var i = 0; i < files1.length; i++) {
		var reg = new RegExp(/layout/gi)
		var match = reg.exec(files1[i])
		let fullpath = path.join(modeldir, files1[i])
		let stat = fs.statSync(fullpath)
		if (!stat.isDirectory() && match) {
			if(fs.existsSync(fullpath)){
				jouer = JSON.parse(fs.readFileSync(fullpath))
				// premiseMap.set(x[0], jsonObj)	
			}
			console.log(`${files1[i]} space json for ${modeldir}`)
			break;
		}
	}
	return jouer
	// let typeMap = listType(__dirname)
	// let premiseMap = new Map()
	// for (var x of typeMap) {
	// 	log.trace(`${x[0]}->${x[1]}`)
		
	// }
	// console.log(`${premiseMap.size} models found under ${__dirname}`)
	// return premiseMap
}
function space() {
	let jouer = undefined
	var files1 = fs.readdirSync(modeldir, { encoding: 'utf-8' })
	for (var i = 0; i < files1.length; i++) {
		var reg = new RegExp(/space/gi)
		var match = reg.exec(files1[i])
		let fullpath = path.join(modeldir, files1[i])
		let stat = fs.statSync(fullpath)
		if (!stat.isDirectory() && match) {
			if(fs.existsSync(fullpath)){
				jouer = JSON.parse(fs.readFileSync(fullpath))
				// premiseMap.set(x[0], jsonObj)	
			}
			console.log(`${files1[i]} space json for ${modeldir}`)
			break;
		}
	}
	return jouer
}
/* 
	modeled physical device
*/
function prepareModel(rootdir){
	var dirs = fs.readdirSync(rootdir, { encoding: 'utf-8' })
	let a = new Map()

	for (var i = 0; i < dirs.length; i++) {
		let path2 = path.join(rootdir, dirs[i])
		var fileStat = fs.statSync(path2)
		
		if (fileStat.isDirectory()) {
			let serviceProvider = {}
			serviceProvider.layout = layout(path2)

			if(serviceProvider.layout){
				serviceProvider.space = space(path2)
				// get sub dir string from path
	
				// let arr = __dirname.split('\\')// Windows or Linux???
				// let lead = arr[arr.length - 1]

				a.set(dirs[i].toUpperCase(), serviceProvider)
				log.debug(dirs[i], path2)
			}
		}
	}
	return a
}
/*
	there are two kinds of space->>
	named or structed:
		We have worked on that one like 3WL 3VA2, 7SJ686 etc.,
*/
// function commissioning(){}
let knownModels = new Map()
function bootstrap() {
	knownModels = prepareModel(__dirname)
	let addr = deserialize(path.join(__dirname, './remote.json'))
	
	let arr = []
	for (let i = 0; i < addr.length; i = i + 1) {
		let sample = addr[i]
		// console.log(`${addr.length}, ${i}`)
		let scramble = undefined

		if(sample && sample.model && knownModels.get(sample.model.toUpperCase())){
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
		}else{
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

// /* Minimum cycle in Node = 1ms and 50ms in Browser mightly */
// function iterateSingleModel(pathDeviceRoot){
// 	// let path1 = path.join(__dirname, folder)
// 	let files1 = fs.readdirSync(pathDeviceRoot, { encoding: 'utf-8' })
// 	let collector = []
// 	for (var i = 0; i < files1.length; i++) {
// 		let path2 = path.join(path1, files1[i])
// 		var fileStat = fs.statSync(path2)
// 		if (fileStat.isDirectory()) {
// 			var files2 = fs.readdirSync(path2, { encoding: 'utf-8' })
// 			for (var j = 0; j < files2.length; j++) {
// 				console.log('located ', files2[j])
// 				if (!fs.statSync(path2).isDirectory && path.extname(files2[j]) === extname) {
// 					let model = {}
// 					model.index = files2[j]
// 					model.path = path2
// 					var reg = new RegExp('*space*', 'gi')
// 					var match = reg.exec(files2[j])
// 					if (null !== match) {
// 						model.space = path.join(path2, files[i])
// 						console.log(`${files2[j]} space json for ${path2}`)
// 					}
// 					model['channel'] = 'modbustcp'
// 					collector.push(model)
// 				}
// 			}
// 		}
// 	}
// 	console.log(`${collector.length} models found under ${folder}`)
// 	return collector
// }

/* 
	raw physical device
		uniformed:
		don't care the structure but rather touch that asset for make sure it is network connected and online and accessible with desired protocol/channel(sometime one device even support several)
		uniform device that means
		NO model attached
		voila cela moi
*/
// function listRawDevice(fullpath){
// 	let jsonArray = JSON.parse(fs.readFileSync(fullpath))
// 	let matrix = prepareModel()
// 	for (let i = 0; i < jsonArray.length; i++) {
// 		let segment = jsonArray[i]
// 		log.debug(segment)
// 		let protocolAbbreviate = removeSymbol(segment.protocol)
// 		let protocolLowerCase = protocolAbbreviate.toLowerCase()
// 		log.debug(protocolLowerCase)
// 		let modelAbbreviate = removeSymbol(segment.model)
// 		let modelLowerCase = modelAbbreviate.toLowerCase()
// 		log.debug(modelLowerCase)
// 		if(matrix.get(modelLowerCase)){
// 			let designated = matrix.get(modelLowerCase)
// 		}
// 	}
// }

module.exports = {
	models: knownModels,
	array,
	bootstrap,
	serialize,
}

// function physical() {
// 	let jouer = undefined
// 	var files1 = fs.readdirSync(modeldir, { encoding: 'utf-8' })
// 	for (var i = 0; i < files1.length; i++) {
// 		var reg = new RegExp(/physical/gi)
// 		var match = reg.exec(files1[i])
// 		let fullpath = path.join(modeldir, files1[i])
// 		let stat = fs.statSync(fullpath)
// 		if (!stat.isDirectory() && match) {
// 			if(fs.existsSync(fullpath)){
// 				jouer = JSON.parse(fs.readFileSync(fullpath))
// 				// premiseMap.set(x[0], jsonObj)	
// 			}
// 			console.log(`${files1[i]} space json for ${modeldir}`)
// 			break;
// 		}
// 	}
// 	return jouer
// }
