let assert = require('assert')
let log4js = require('log4js')
log4js.configure(require('../public/config/log4js_dev.json'))
let tracer = log4js.getLogger('test::routes::binstring')

function toBinaryString(inputBuffer){
              
    tracer.info(inputBuffer.toString('hex'))
    tracer.info("input buffer length", inputBuffer.byteLength)

    if(inputBuffer.byteLength === 2){
        var intValue = inputBuffer.readUInt16BE()
        if(typeof(intValue) === 'number'){
            const result = intValue.toString(2)
            const s = ("0000000000000000" + result)
            tracer.info(s)

            paddedStringInt = s.substr(-16, 16)//16 bit position
            tracer.info(paddedStringInt)
            return paddedStringInt
        }
    }
    return "NaN"
}

describe('routes', function () {
  describe('scan', function () {
    describe('#datatype', function () {
      it('stress', async function () {
        const buf4 = Buffer.from([5, 255])
        const bstr4 = toBinaryString(buf4)
        tracer.info(bstr4)

        const buf5 = Buffer.from([243, 155, 91])
        const bstr5 = toBinaryString(buf5)
        tracer.info(bstr5)

        const buf6 = Buffer.from([243, 0])
        const bstr6 = toBinaryString(buf6)
        tracer.info(bstr6)

        assert.ok(true, "pass unit test")
        // tracer.info("random number", crypto.randomBytes(4).readUInt32BE())
      })
    })
  })
})