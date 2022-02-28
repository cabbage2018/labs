describe('routes', function () {
  describe('scan', function () {
    describe('#datatype', function () {
      it('boundray', async function () {
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