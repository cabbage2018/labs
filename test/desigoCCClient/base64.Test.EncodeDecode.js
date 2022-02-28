'use strict'
let fs = require('fs')
let expect = require('chai').expect

describe(__filename, function () {
  describe('Base64 Encoded and plain string transforming', function () {  
    before((done) => {
      done()
    })

    it(`create file from base64 encoded string`, function (done) {
      let textString = 'create file from base64 encoded string'
      console.log('******** original string ********')
      console.log(textString)

      let bitmap = new Buffer.from(textString, 'base64')
      console.log('******** base64 encoded but presented as string ********')
      console.log(bitmap)
      
      let recoveredString = new Buffer.from(bitmap, 'base64').toString('hex')
      console.log('******** base64 deencoded as string ********')
      console.log(recoveredString)
      expect(textString == recoveredString, 'encode and decode base64? ').to.be.true
      done()
    })

    it(`bootstrap from a image file`, function (done) {
      
      let base64Encode = new Buffer(fs.readFileSync('./test/signalR/kitten.jpg')).toString('base64')
      let kittenEncoded = new Buffer.from(base64Encode, 'base64')

      let writeResult = fs.writeFileSync('./test/signalR/kitten.copy.jpg', kittenEncoded)
      expect(kittenEncoded.length >= 19000, 'encode and decode base64? ').to.be.true
      done()
    })

    it(`bootstrap from a image file`, function (done) {
      let binfile = fs.readFileSync('./test/signalR/kitten.jpg', 'binary')
      let base64 = binfile.toString('base64')
      let binstream = new Buffer.from(base64, 'base64')
      let writeResult = fs.writeFileSync('./test/signalR/kitten.r.jpg', binstream/*binfile*//*binstream.toString('bin')*/, 'binary')
      console.log(writeResult)
      expect(fs.existsSync('./test/signalR/kitten.r.jpg') === true, 'encode and decode base64? ').to.be.true
      done()
    })

    after(() => {
      console.log('existing test case...')
    })
  })
})