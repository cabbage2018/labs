'use strict'
const expect = require('chai').expect
let soap = require('soap')

describe('management_server_host', function () {
  describe('services', function () {
    let config = require('./ServiceRegistrationService.js')

    before(() => {
      console.log('before test we build host and port configuration')
      expect(config.host.length > 8, 'config.host is an valid ip addressss?').to.be.true
    })

    it('soap to managementserver', function (done) {
      let url = config.cmdsvc ///`http://${config.host}:${config.port}/ManagementServer/ServerCommandService.svc?wsdl`
      let options1_1 = ``

      soap.createClient(url, options1_1, function (error, client) {
        if(error) {
          console.log(error)
          done(error)
        } else {
          console.log(client)
        }
        client.Login(``, function(err, result) {
          if(err) {
            console.log(err)
            done(err)
          }
          console.log(result)
          expect(result !== undefined, 'config.host is an valid ip addressss?').to.be.true
          done()
        });
      });
    });
    // ManagementServer / ServiceRegistrationService.svc
    it('soap to ManagementServer / ServiceRegistrationService.svc', function (done) {
      let url = config.rgrsvc ///`http://${ServiceRegistrationServiceConfig.host}:${ServiceRegistrationServiceConfig.port}/ManagementServer/ServiceRegistrationService.svc?wsdl`
      let options1_1 = ``
      let args = {}

      soap.createClient(url, options1_1, function (error, client) {
        if (error) {
          console.log(error)
          done(error)
        } else {
          console.log(client)
        }

        client.GetVersion(args, function (err, result) {
          if (err) {
            console.log(err)
            done(err)
          } else {
            console.log(result)
          }
        })

        client.Close(args, function (err, result) {
          if (err) {
            console.log(err)
            done(err)
          }
          console.log(result)
          expect(result !== undefined, 'config.host is an valid ip addressss?').to.be.true
          done()
        });
      });
    });


    after(()=> {
      console.log('existing the test case...');
    });
  });
})