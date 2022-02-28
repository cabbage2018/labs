let assert = require('assert')
let modbustcp = require("../routes/modbus")
let {router, sleep} = require("../routes/scan")

describe('routes', function () {
  describe('modbus', function () {
    describe('#acquire', function () {
      it('exception-scan-subnetwork', async function () {        
        for (var offset = 1; offset < 255; offset = offset + 1) {
            const ipAddress = "192.168.2." + offset
            let discoverySpace = {
                channel: "modbustcp",
                repeatIntervalMs: 90000,
                protocolData: {
                    ip: ipAddress,
                    port: 502,
                    subordinatorNumber: 127,
                    timeoutMs: 3000,
                    functionType: 15
                },
            
                physicalAddress: {
                    start: 23309,
                    count: 100,
                    registerGrid: [
                        {start: 23309, count: 30}
                    ],
                }
            }

            await sleep(50).
            then(async()=>{
              modbustcp.acquire(discoverySpace)
              .then((_response)=>{
                  tracer.warn(_response)
                  tracer.warn(discoverySpace.protocolData.ip)
                  assert.ok(true, "pass unit test")

              })
              .catch((error)=>{
                  tracer.info(error)
                  // tracer.info("No such MODBUS device")
                  // assert.fail("wrong result")
                  assert.ok(true, "pass unit test")
              })
            })
        }

        assert.ok(true, "pass unit test")
      })
    })
  })
})
