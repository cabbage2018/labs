'use strict'
// let express = require('express');
// let router = express.Router();
// module.exports = router
let fs = require('fs')
let path = require('path')
let readline = require('readline')
module.exports = {
	abstract: async function (req, res, next) {
		let configure = JSON.parse(fs.readFileSync(path.join(process.cwd(), './opcua.json')))
		acquire(configure)
			.then((res) => {
				let list = res
				res.render('page/list', {
					title: __filename + new Date().toISOString(),
					items: list
				})
			})
			.catch((err) => {
				res.send(__filename + JSON.stringify(err))
			})
	},
	profile: function (req, res, next) {
		let fRead = fs.createReadStream(path.join(process.cwd(), './logs/livre.log'))
		let objReadline = readline.createInterface({
			input: fRead
		})
		let arr = new Array()
		objReadline.on('line', line => {
			arr.push(line);
		})
		objReadline.on('close', () => {
			res.render('list', {
				title: __filename + new Date().toISOString(),
				items: arr
			})
			objReadline.close();
		})
	}
}