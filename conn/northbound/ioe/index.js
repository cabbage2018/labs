/**
"dependencies": { "mqtt": "2.18.8" }
*/
const mqtt = require('mqtt');
const log4js = require('log4js')
const tracer = log4js.getLogger('conn::northbound::centos8')
const options = require("../../../public/connectivity/options_ioe").options;
const url = require("../../../public/connectivity/options_ioe").url;
const { JSONCookies } = require('cookie-parser');
let client = mqtt.connect(url, options)
const topic = "timeseries"
client.on('connect', function () {
	client.subscribe(topic)
})
client.on('error', function (err) {
	tracer.debug(err)
	client.end()
})
client.on('message', function (topic, message) {
	// tracer.debug(topic, message)
})
module.exports = {
	pub: function (topic, filename) {
		let json = JSON.parse(fs.readFileSync())
		client.publish(topic, JSONCookies)
			.then((results) => {
				console.log(`${topic}, message: ${}`)
			})
			.catch(err => {
				console.log(err)
			})
	},
	sub: function () { }
}