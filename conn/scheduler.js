
function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms);
    })
}
  
let acquisitionTask = setTimeout(async function () {
	console.log('setTimeout clock...' + new Date().toISOString())
	benchmark()
}, 15 * 1000)

// renew
let hourlyReport = cron.schedule('0 0 */1 * * *', () => {
	// clearInterval(acquisitionTask)
	acquisitionTask = setTimeout(async function () {
		console.log('setTimeout clock...' + new Date().toISOString())
		benchmark()
	}, 15 * 1000)
})
hourlyReport.start()

function terminate() {
	// clearInterval(acquisitionTask)
	clearTimeout(acquisitionTask)
}

let profilingDictionary = new Map()
// function visualize(response){  
//   const buffer = Buffer.from(response.response._body._valuesAsBuffer);
//   const title = `${response.request._body._start}_${response.request._body._fc}`
//   log.debug(buffer.byteLength)
//   log.debug(buffer.toString())
//   for (var offset = 0; offset < buffer.length/2; offset = offset + 1) {
//       const dataword = buffer.slice(2 * offset, 2 * offset + 2)
//       log.info(title + '_' + offset, ": ", dataword.toString('hex'))
//       profilingDictionary.set(title + '_' + offset, dataword.toString('hex') + '(' + dataword.readUInt16BE() + ')')
//   }
//   return;
// }
