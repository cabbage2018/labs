'use strict'
let log4js = require('log4js')
let log = log4js.getLogger('daq::conduit::page@@commissioning')

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
