'use strict'
let modbustcp = require("../modbus")
let log4js = require('log4js')
let log = log4js.getLogger('routes::discovery')
let modbusTCPDictionary = new Map()
setTimeout( async function() {
    const startMoment = new Date().getTime()
    let refip = "192.168.2"
    for(var j = 1; j < 255; j ++){
        await sleep(50).
        then(async()=>{
          candidateIpAddress.protocolData.ip = refip + "." + j            
          await modbustcp.acquire(candidateIpAddress)
            .then((_response) => {
              modbusTCPDictionary.set(error.connected.ip, "target connectable.")
            })
            .catch((error) => {
              log.fatal(candidateIpAddress, error)
            })
        })
    }
    const endMoment = new Date().getTime()
    log.warn("Profiling: ", endMoment-startMoment, " millisecond")
}, 3000)

sleep(13000)
.then( async ()=>{
  log.fatal(modbusTCPDictionary.size)
  for (let entry in modbusTCPDictionary) {
    log.debug(entry[0], entry[1])
   }
})
.catch((error)=>{
})

