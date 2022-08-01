// 3.5 Act on incoming message, todo: assemble message from several payload packets,
relay.messageConsumers.push((topic, textContent) => {
    if(topic.indexOf(selftopic) >= 0 && selftopic.indexOf(topic) >= 0){
        try{
            const suiteObj = JSON.parse(textContent)
            const decoded = decoder.forge(suiteObj, displayCallback)
            if(decoded !== null){
                const s = JSON.stringify(decoded)
                // on success
                relay.localbroker.publish(nextStop, s)
            }else{
                tracer.warn("decoder.forge(suiteObj, displayCallback): ", decoded)
            }
        }catch(error){
            tracer.error(error)
        }
    }
})


function deliver(MqttsOptions, signalArray) {
	let deliverPromise = new Promise(async function (resolve, reject) {
  
		  let client = mqtt.connect(MqttsOptions.endpointUrl, MqttsOptions.options)	
  
		  client.on('report', function () {
		log.debug('report: ', report)
	  })
  
		  client.on('error', function (err) {
			  alert.error('mqtt connect #', err)
			  client.end()
			  reject(err)
		  })	
  
		  client.on('message', function (topic, message) {
			  log.info(`MQTTs deliver topic=${topic}, message=${message}`)
  
			  setTimeout(async function () {
				  resolve(`task due to timer time out/MQTTs deliver topic=${topic}, message=${message}`)
  
			  client.unsubscribe(topic, (err, packet)=>{
				  client.end(true, (err)=>{
					  alert.error('mqtt close #', err)
				  })
				  log.info(`unsubscribe.`)
  
				  // client = null
			  })
  
			  }, 3000);
		  })
  
		  client.on('connect', function () {
			  client.subscribe(MqttsOptions.subscribeTopic)
			  client.publish(MqttsOptions.publishTopic, JSON.stringify(signalArray), (err, packet)=>{
				  if(err){
					  log.error(err)
					  reject(err)
				  }
  
				  if(packet){
					  log.mark(packet)
				  }				
			  })	
			  // resolve('Connected mqtt successfully!')
		  })
		  
	})
	return deliverPromise
  }

  

for (let j = 0; j < mqttConnectionOptionArray.length; j = j + 1) {
	let mqttConnectionOptions = mqttConnectionOptionArray[j]
	await deliver(mqttConnectionOptions, dev)
		.then((acknowledge) => {
			log.mark(acknowledge)
		})
		.catch((e) => {
			log.error(e)
		})

}
