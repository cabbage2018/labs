'use strict'
const fs = require("fs")
let path = require('path')
module.exports = {
	mapToObj: function (map) {
		const obj = {}
		for (let [k, v] of map)
			obj[k] = v
		return obj
	},
	filter: function (dataobj) {
		let recordpath = dataobj['ds']//datasource
		let recordtime = dataobj["ts"]//timestamp
		let recordmap = dataobj.dparray//data-pair array(var id->val) for making the data dictionary
		if (recordpath && recordtime && recordmap) {
			let filename = (recordpath /*+ recordtime.toISOString()*/).replace(/[-:./\\]/gi, "_")
			let fullpath = path.join(process.cwd(), filename)
			let jsonmap = new Map()
			jsonmap.set('_ts', recordtime.toISOString())

			// remove duplicates: [{'key':'active_power', 'value': 9870.541}, {'key': 'voltage', 'value': 220.542}]
			recordmap.forEach(e => {
				jsonmap.set(e.key, e.value)
			})

			// map to obj
			const obj = this.mapToObj(jsonmap)

			// obj to str
			const objstr = JSON.stringify(obj)
			fs.appendFileSync(fullpath, objstr)
			console.log(`raw data as object-revealed string: ${objstr},`)
			return
		} else {
			console.log(`wrong raw data format as seen: ${dataobj}, cannot locate field: ds, ts, dparray`)
		}
	},
}