'use strict'
// let express = require('express');
// let router = express.Router();
// module.exports = router
let fs = require('fs')
let path = require('path')
let readline = require('readline')

const {
	AttributeIds,
	OPCUAClient,
	TimestampsToReturn,
} = require("node-opcua")

module.exports = {
	// let application layer decide this array size not us.
	acquire: async function (endpointUrl, nodeArray) {
		var arr = [];
		for (var i = 0; i < nodeArray.length/*SOME DEVICE LIKE SIMOCODE PROV PN HAS VERY SMALL LIMIT; but SCADA has bigger*/; i += 1) {
			arr.push({ nodeId: nodeArray[i].nodeid, attributeId: AttributeIds.Value });
		}
		let promisePhysicalLayer = new Promise(function (resolve, reject) {
			try {
				const client = OPCUAClient.create({
					endpoint_must_exist: false,
					connectionStrategy: {
						maxRetry: 5,
						initialDelay: 1000,
						maxDelay: 0
					}
				})
				client.on("backoff", (retry, delay) => {
					reject({ r: retry, d: delay, t: 'backoff' })
				})
				client.on("error", (e) => {
					reject(e)
				})
				await client.connect(endpointUrl)
				const session = await client.createSession();
				let responseValues = {}
				responseValues['url'] = endpointUrl
				responseValues['nodes'] = nodeArray
				responseValues.resp = await session.readVariableValue(arr)//read
				//responseValues.concat(t.values)
				const browseResult = await session.browse("RootFolder");
				log.debug(browseResult.references.map((r) => r.browseName.toString()).join("\n"));
				const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
				log.debug(` value = ${dataValue.value.value.toString()}`);
				await session.close()
				await client.disconnect()
				resolve(responseValues)
			}
			catch (err) {
				if (session) {
					await session.close()
					session = null
				}
				if (client) {
					await client.disconnect()
					client = null
				}
				reject(err)
				log.debug("Error !!!", err)
			}
		})
		return promisePhysicalLayer
	},
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