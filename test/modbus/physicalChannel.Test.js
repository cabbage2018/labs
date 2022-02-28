let expect = require('chai').expect
const modbusTCPmaster = require('js-modbus')
describe('component', function () {
  describe('daq', function () {
    it('normal', async function (done) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      modbusTCPmaster.startJob()
      .then((response)=>{console.log(response); done()})
      .catch((err)=>{console.log(err); done(err)})
      sleep(60);   /// wait for remote reply~~~
      expect(modbusTCPmaster !== null, '7.7.4 test.modbusTCPmaster? ').to.be.true
    })
  })
})