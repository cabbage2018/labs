'use strict'
let daq = require('../channel/daq')
let benchmark = require('../channel/daq/benchmark')
let scan = require('../channel/daq/scan')

let dsmap = new Map()

function sleep(ms) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, ms);
	})
}

sleep(60 * 1000)
	.then((res) => {
		scan.handle()
	})
	.catch((err) => {
		console.log(err)
	})

module.exports = {
	handlerArray: [],
	register: function (dispatcher) {
		this.handlerArray.push(dispatcher)
	},
	commissionSeg: function (protocolDescription) {
		let protocolString = protocolDescription.protocol
		if (protocolDescription && protocolDescription.protocol) {
			let l0 = dsmap.get(protocolDescription.protocol)
			if (l0) {
				l0.push(protocolDescription)
				dsmap.set(protocolString, datasourceList)
			} else {
				dsmap.set(protocolString, [protocolDescription])
			}
		}
		return
	},
	commissionQuarterAligned: function (protocolForEnergyMetering) {

	},
	commissioning: function (protocolAggregates) {
		//for(let i = 0 ){}
		protocolAggregates.forEach(p => {
			if (p.isEnergyMetering) {
				//aligned to hour or, quarter's of a clock
				commissionQuarterAligned(p)
			} else {
				this.commissionSeg(p)
			}
		})
	},
	onReceive: function () { }
}