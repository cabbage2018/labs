'use strict'
const fs = require("fs")
let path = require('path')
module.exports = {
	realtimeseries: new Map(),
	mapToObj: function (map) {
		const obj = {}
		for (let [k, v] of map)
			obj[k] = v
		return obj
	},
	logElements: function (value, key, map) {
		console.log(`m[${key}] = ${value}`);
	},
	filter: function (dataobj) {
		let recordpath = dataobj['ds']//datasource
		let recordtime = dataobj["ts"].toISOString()//timestamp
		let recordmap = dataobj.dparray//data-pair array(var id->val) for making the data dictionary
		if (recordpath && recordtime && recordmap) {
			//let filename = (recordpath).replace(/[-:./\\]/gi, "_")
			let fullpath = path.join(process.cwd(), filename)
			//let jsonmap = new Map()
			// first column
			if (realtimeseries.get('_ts')) {
				realtimeseries.get('_ts').push(recordtime)
			} else {
				realtimeseries.set('_ts', [recordtime])
			}
			// further column
			recordmap.forEach(e => {
				if (realtimeseries.get(e.key)) {
					realtimeseries.get(e.key).push(e.value)
				} else {
					realtimeseries.set(e.key, [e.value])
				}
			})
			//
			// archive every 15 minutes if sample rate = 1s/second;
			if (realtimeseries.get('_ts').length > 900) {
				// plot the diagram
				realtimeseries.forEach(e => {
					if (Number.isFinite(e.value[0])) {
						console.log(` ${e.value[0]}`)
					}
				})

				// archive...
				const pivot = {}
				pivot.title = []
				// first row is title,
				realtimeseries.forEach(e => {
					pivot.title.push(e.key)
				})
				// further row are timeseries value matrix,
				for (let i = 0; i < realtimeseries.get('_ts').length; i = i + 1) {
					realtimeseries.forEach(e => {
						pivot[realtimeseries.get('_ts')[i]].push(e.value[i])
						//for (let j = 0; j < e.value.length; j = j + 1) {
						//}
					})
				}
				// otherwise data is not formatted... warn and quit quietly
				//
				// 2-dimension matrix print
				for (var r of pivot) {
					let rs = ""
					for (var e of r) {
						rs += e + ", ";
					}
					console.log(`${rs}.`)
					//console.log(`\n`)
				}
				console.log(`pivot: ${pivot}.`)
				//pivot = {}//?shall i do this to release RAM
				realtimeseries.clear()
				console.log(`map size after archive and clear: ${realtimeseries.size}.`)
				//realtimeseries = new Map()
			}
			return
		} else {
			console.log(`wrong raw data format as seen: ${dataobj}, cannot locate field: ds, ts, dparray`)
		}
	},
}