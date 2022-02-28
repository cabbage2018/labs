'use strict'
let expect = require('chai').expect
let signalr = require('node-signalr')

let log4js = require('log4js')
log4js.configure(require('./log'))
let archive = log4js.getLogger('archive')
let access = log4js.getLogger('access')
let track = log4js.getLogger('test::signalR::DesigoCC.Test')
track.info(`${process.env.NODE_ENV} = process.env.NODE_ENV`)
archive.error(__dirname)

describe(__filename, function () {

  describe('Wrapper Container #1', function () {

    let request = require('supertest')
    let access_token = undefined
    
    before((done) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      console.log('before test we build process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\'')
      
      request('https://DESKTOP-EKA5VDD:8443')
        .post('/api/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Access-Control-Allow-Origin', '*')
        .send('grant_type=password&username=defaultAdmin&password=cc')
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
        request('https://desktop-eka5vdd:8443')
          .get('/api/events')
          .set('Access-Control-Allow-Origin', '*')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + access_token)
          .send('')
          .expect(200)
          .end(function (err, res) {
            accessl.info(`Events module`)

            if (err) {
              done(err)
            } else {
              archivel.info(res.body)
              expect(res.body !== undefined, 'https res Events !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Heartbeat`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .post('/api/heartbeat')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              track.error(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。        
              done(err)
            } else {
              archivel.info(res.body)
              expect(res.body !== undefined, 'https heartbeat !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Heartbeat`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .post('/api/heartbeat')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              track.error(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。        
              done(err)
            } else {
              archivel.info(res.body)
              expect(res.body !== undefined, 'https heartbeat !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Diagnostics`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/diagnostics')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            if (err) {
              track.error(err);//得到返回我们可以用2.2中的断言对返回结果进行判断。        
              done(err)
            } else {
              archivel.info(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })
    
    after(() => {
      console.log('existing test case...')
    })
  })
})