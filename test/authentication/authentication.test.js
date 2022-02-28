'use strict'
const expect = require('chai').expect;

describe('Milestone', function () {
  describe('VMS', function () {

    let config = require('../../public/sysconfig')

    before(()=> {
      console.log('should print before test')
    });

    it('protocol integration should be connected then', function () {
      console.log(config.host)
      expect(config.host.length, 'config.host is an valid ip addressss?').to.equal(9)
    });

    it('protocol integration should apply correct port', function () {
      console.log(config.port)
      expect(config.port, 'config.host is an valid ip addressss?').to.equal(80)
    });

    /*
    To connect to the ServerCommandService, use an URL like:
    To XProtect Corporate: http://{host:port}/ServerAPI/ServerCommandService.asmx
    To other XProtect platforms: http://{host:port}/ServerCommandService/ServerCommandService.asmx
    */

    it('get through correct url as other xprotect platform!', function () {
      let host = config.host;
      let port = config.port;
      let url = `http://${host}:${port}/ServerCommandService/ServerCommandService.asmx`;
      console.log(url)
      expect(url.indexOf('10.0.0.') > 0, 'config.host is an valid ip addressss?').to.be.true
    });

    after(()=> {
      console.log('existing the test case...');
    });
  });
});
