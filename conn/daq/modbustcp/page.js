'use strict'
let log4js = require('log4js')
let log = log4js.getLogger('commissioning::decode::page')

/// used to generate data, internally
function cyclicdata(modelObject){
	// let dictionary = new Map()
	let array = []
	for (let i = 0; i < modelObject.length; i += 1) {
		if(modelObject[i].cyclicdata){
			array.push(modelObject[i])
			// dictionary.set(modelObject[i].cyclicdata, modelObject[i])///functioncode + '_' + modelObject[i].register + '_' + modelObject[i].quantity
		}
	}
	return array
}

function layoutdata(modelObject){
	// let dictionary = new Map()
	let array = []
	for (let i = 0; i < modelObject.length; i += 1) {
		if(modelObject[i].layoutdata){
			array.push(modelObject[i])
			// dictionary.set(modelObject[i].layout/* + '_' + modelObject[i].register*/, modelObject[i])
		}
	}
	return array
}

function elementdata(modelObject){
	let array = []
	// let dictionary = new Map()
	for (let i = 0; i < modelObject.length; i += 1) {

		if(modelObject[i].elementdata){
			let sample = {}
			let _entry = modelObject[i]
			sample.menu = _entry.menu
			sample.bitcount = _entry.bitcount

			///signal
			if(_entry.signal){
				sample.signal = _entry.signal
			}

			///events
			if(_entry.events){
				sample.events = new Map()
				
				for (let j = 0; j < _entry.events.length; j += 1) {
					sample.events.set(_entry.events[j].key, _entry.events[j])
				}
			}

			///measure
			if(_entry.measure){
				sample.measure = _entry.measure
			}

			// log.fatal(sample)
			array.push(sample)
		}
	}
	
	return array
}

function buildDictionaryFromArray(filepath) {
	let rawFormatter = require(filepath)
	let refinedModel = {}
	refinedModel.cyclic = cyclicdata(rawFormatter)
	refinedModel.layout = layoutdata(rawFormatter)
	refinedModel.element = elementdata(rawFormatter)
	
	log.error(refinedModel)

	return refinedModel;
}

function measure(buf, dataType) {
	let dbuffer = Buffer.from(buf)
	let refinedDataType = dataType.replace(/[ ,.:/\\]/gi, "")
	let result = undefined
	try{
		switch (refinedDataType.toUpperCase()) {

			case "LONG":
				if(dbuffer.length < 8) {return null;} else {
					return dbuffer.readBigUInt64BE(0)
				}
			break;

			case "FLOAT":
				result = dbuffer.readFloatBE(0)//LE
			break;

			case "DOUBLE":
				result = dbuffer.readDoubleBE(0)
				break;

			case "INT":
				result = dbuffer.readInt32BE(0)//dbuffer.readInt16BE()// 3WL's INT differs from normal understanding.
			break;

			case "UNSIGNEDCHAR":
				result = dbuffer.readUInt8(0)
			break;

			case "SIGNEDCHAR":
				result = dbuffer.readInt8(0)
			break;

			case "UNSIGNEDINT":
				result = dbuffer.readUInt16BE(0)
			break;

			case "SIGNEDINT":
				result = dbuffer.readInt16BE(0)
			break;

			case "UNSIGNEDLONG":
				result = dbuffer.readUInt32BE(0)
			break;

			case "SIGNEDLONG":
				result = dbuffer.readInt32BE(0)
			break;

			default:	///As 'String'
			result = dbuffer.toString('hex')//particle.quality = 0x8000ffff
			break;
		}
	} catch(error){
		throw new Error('PARSE MEASURE E')
		return null;
	}
	return result
}

// offset and bits both less than 32
function signal(buf, refinedOffset, bits) {
	let dbuffer = Buffer.from(buf)
	if(refinedOffset > 31 || refinedOffset + bits > 31) {
		return undefined
	}

	try{
		let interim = dbuffer.readUInt8(0)
		if(bits > 32) { interim = dbuffer.toString(16)} else
		if(bits > 0) {
			switch (bits) {
				case 8:
					switch (buf.length) {
						case 1:
							interim = dbuffer.readUInt8(0)
							break;
						case 2:
							/// overlapped 2 bytes although bits < 8
							interim = dbuffer.readUInt16BE(0)
						default:
							throw new Error('')
						break;
					}
				break;
	
				case 16:
					switch (buf.length) {
						case 2:
							interim = dbuffer.readUInt16BE(0)
						break;
						case 4:
							/// overlapped 2 bytes although bits < 8
							interim = dbuffer.readUInt32BE(0)
						default:
							throw new Error('')
						break;
					}
				break;
	
				case 32:
					interim = dbuffer.readUInt32BE(0)
				break;
	
				default:
					return dbuffer.toString('hex')//particle.quality = 0x8000ffff
				break;
			}
		} else {interim = null}

		/// bitmask
		let mask = 0x0
		for (let i = refinedOffset; i < refinedOffset + bits; i += 1) {
			mask |= (0x1 << i)///only valid for 32bits number in Javascript...
		}
		let result = (interim & mask)
		return result

	} catch(error){
		throw new Error('PARSE SIGNAL E')
	}
	return null;
}

// revised logic

/*
	model
		cyclicdata
		layoutdata
		elementdata
			signals[array]
				events[dictionary: offset_bits_value, menu string]
			elements[array]

*/

	// target is: make them readable String with Context
	// measure(PQSinputoutput[kWh/C]) = 3909093.5678773 
	// status(tripconditionsonoffalarm) = 0x2490
	// event('overload trip short circuits both detected') = 2021.03.24T21:38:56:277Z 

	// so there is only one table which was condensed with rules like measures, statuss, events, etc.,
function crossCompile(rawdataObj, modelElementObj, settleCallback) {

	let buffer = Buffer.from(rawdataObj.response._body._valuesAsBuffer)
	let timestampAsObject = rawdataObj.metrics.receivedAt
	log.fatal(`[${buffer.length}]: [buffer length], timestamp receivedAt ${timestampAsObject}`);

	// remote measure
	if(modelElementObj.measure !== undefined) {

		for (let i = 0; i < modelElementObj.measure.length; i += 1) {			
			const _node = modelElementObj.measure[i]
			let _offset = _node.offset
			let _bits = _node.bits
			let _byteStart = parseInt(_offset / 8) // only integer part
			let _byteEndNext = /**/parseInt((_offset + _bits) / 8)  // + 1 next position to end

			if(_offset % 8 !== 0) {}
			if((_offset + _bits) % 8 != 0) {
				log.info('aligning... ', (_offset + _bits), Math.ceil((_offset + _bits) / 8) + 1);
				_byteEndNext = Math.ceil((_offset + _bits) / 8) + 1
			}

			let focused = buffer.slice(_byteStart, _byteEndNext)
			let clone = Buffer.from(focused)

			// log.warn(`[${clone.toString('hex')}]: [${clone.length}]`);
			_node.value = measure(clone, _node.format);
			if(_node.value !== null && _node.value !== undefined) {
				log.warn('_offset: ', _offset, _bits, _byteStart, _byteEndNext, '-> ', clone, _node.value);

				settleCallback(`measure(${_node.menu}) [${_node.unit}]`, _node.value);
			}
		}
	}

	// status as signal
	// let signalDictionary = new Map()
	if(modelElementObj.signal !== undefined) {
		///events process after signal decoding
		let enumEventsDictionary = modelElementObj.signal.events;

		for (let i = 0; i < modelElementObj.signal.length; i += 1) {
			const _node = modelElementObj.signal[i]
			let _offset = _node.offset
			let _bits = _node.bits
			/// force _offset 32-bit aligned this time!
			let _32_bit_aligned_offset = parseInt(_offset - parseInt(_offset / 32) * 32)
			let _32_bit_aligned_start = Math.ceil((_32_bit_aligned_offset) / 8)
			let _32_bit_aligned_stop = Math.ceil((_32_bit_aligned_offset + bits) / 8)
			let _byteOccupancy = _32_bit_aligned_start - _32_bit_aligned_stop + 1///enigma
			let byteTotal = 0
			switch (_byteOccupancy) {
				case 1:
				case 2:
					byteTotal = _byteOccupancy;
				break;
				
				case 3:
					byteTotal = _byteOccupancy + 1;
				break;
				
				case 4:
					byteTotal = _byteOccupancy;
				break;

				default:
					throw new Error(`Should not process SIGNAL longer than 32 bit! byteTotal= ${byteTotal}`);
				// break;
			}

			let _realStart = Math.ceil((_offset) / 8)
			if(_realStart + byteTotal <= buffer.length) {
				let focused = buffer.slice(_realStart, _realStart + byteTotal + 0)
				let clone = Buffer.from(focused)
				log.warn(`[${clone.toString('hex')} length's ${clone.length}(must be 1,2,4, and broken Error)]: when decoding signals`);
				_node.value = signal(clone, _32_bit_aligned_start, _bits);
				

				// enums based Event
				let keyString = _offset + '_' + _bits + '_' + _node.value
				let enumStringFound = enumEventsDictionary.get(keyString)
				if(enumStringFound) {
					settleCallback(`event(${enumStringFound})`, timestampAsObject)
					log.debug(`${keyString}: ${enumStringFound}, ${timestampAsObject};`)
				}
				///events enum


				if(_node.value !== null && _node.value !== undefined) {
					console.log('_offset: ', _offset, _bits, _byteStart, _byteEndNext, '-> ', clone, _node.value);
					// signalDictionary.set( _offset + '_' + _bits + '_' + _node.value, new Date());
					settleCallback(`status(${_node.menu})`, _node.value);
				}
			}
		}

	}
	return;
}

module.exports = {
	buildDictionaryFromArray: buildDictionaryFromArray,
	crossCompile: crossCompile,
}