'use strict'
let expect = require('chai').expect
let signalr = require('node-signalr')

let log4js = require('log4js')
if (process.env.NODE_ENV === 'production') {
  log4js.configure(require('./log'))
} else {
  log4js.configure(require('./log'))
}
log4js.configure(require('./log'))
let archive = log4js.getLogger('archive')
let access = log4js.getLogger('access')
let track = log4js.getLogger('test::signalR::DesigoCC.Test.EventCounter')
track.info(`${process.env.NODE_ENV} = process.env.NODE_ENV`)
archive.error(__dirname)

describe(__filename, function () {

  describe('RESTful-signalRAPI', function () {
  
    let request = require('supertest')
    let access_token = undefined
  
    before((done) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      console.log('before test we build process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\'')

      request('https://DESKTOP-EKA5VDD:8443')
        .post('/api/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .send('grant_type=password&username=defaultadmin&password=cc')
        .expect(200)
        .then(results => {
          if (results.error !== null
            && typeof results.error !== 'undefined'
            && results.error !== false) {
            console.log(util.inspect(results.error));
          }
          access_token = results.body.access_token
          expect(access_token !== undefined, 'https sign-in !== null? ').to.be.true
          done()
        })
        .catch(err => {
          console.error(err);
          done(err);
        })
      
    })

    it(`Events`, function (done) {
      if (access_token !== undefined) {
        archivel.info(access_token)
        request('https://DESKTOP-EKA5VDD:8443')
          .get('/api/eventcounters')
          .set('Access-Control-Allow-Origin', '*')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + access_token)
          .send('')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err)
            } else {
              expect(res.body !== undefined, 'https Get Event Counter !== null? ').to.be.true
              archivel.info(res.body)
              done()
            }
          })
      } else {
        done('Error: wrong token')
      }

    })

    after(() => {
      console.log('existing test case...')
    })
  })
})