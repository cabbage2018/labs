let assert = require('assert')
let modbustcp = require("../../routes/modbus")
function sleep(ms) {
  return new Promise(function(resolve, reject) {
      setTimeout(resolve, ms);
  })
}

describe('routes', function () {
  describe('modbus', function () {
    describe('#acquire', function () {
      it('exception-category', async function () {

        let discoverySpace = {
            channel: "modbustcp",
            repeatIntervalMs: 1500,
            protocolData: {
                ip: "192.168.2.135",
                port: 502,
                subordinatorNumber: 127,
                timeoutMs: 1000,
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
        
        await sleep(150).
        then(async()=>{
            modbustcp.acquire(discoverySpace)
            .then((_response)=>{
                tracer.info(_response)
                tracer.info("Identified")
                assert.ok(true, "pass unit test")

            })
            .catch((error)=>{
                tracer.info(error)
                tracer.info("No such MODBUS device")
                assert.fail("wrong result")

            })
        })
        
        assert.ok(true, "pass unit test")
      })
    })
  })
})


describe('routes', function () {
    describe('modbus', function () {
      describe('#acquire', function () {
        it('no-such-device', async function () {
  
          let discoverySpace = {
              channel: "modbustcp",
              repeatIntervalMs: 1500,
              protocolData: {
                  ip: "192.168.2.136",
                  port: 502,
                  subordinatorNumber: 127,
                  timeoutMs: 1000,
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
          
          await sleep(150).
          then(async()=>{
              modbustcp.acquire(discoverySpace)
              .then((_response)=>{
                  tracer.info(_response)
                  tracer.info("Identified")
                  assert.fail("wrong result")

              })
              .catch((error)=>{
                  tracer.info(error)
                  tracer.info("No such MODBUS device")
                  assert.ok(true, "pass unit test")
  
            })
          })
          
        })
      })
    })
  })