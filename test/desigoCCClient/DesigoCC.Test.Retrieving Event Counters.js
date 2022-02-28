'use strict'
let expect = require('chai').expect
let signalr = require('node-signalr')
console.log(process.env.NODE_ENV)
let log4js = require('log4js')
log4js.configure(require('./log'))
let track = log4js.getLogger('test::signalR::Retrieving Event Counters')
let archive = log4js.getLogger('archive')
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
        .send('grant_type=password&username=defaultAdmin&password=cc')
        .expect(200)
        .then(results => {
          if (results.error !== null
            && typeof results.error !== 'undefined'
            && results.error !== false) {
            console.log(util.inspect(results.error));
          }
          archive.debug(request)
          archive.debug(results)
          archive.debug('---------------')
          access_token = results.body.access_token
          expect(access_token !== undefined, 'https sign-in pass? ').to.be.true
          done();
        })
        .catch(err => {
          archive.error(err);
          done(err);
        })
        
    })

    it(`Retrieving Event Counters#0`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/0')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#1`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/1')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')
            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })


    it(`Retrieving Event Counters#2`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/2')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#3`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/3')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')
            if (err) {
              archive.error(err)
              done(err)
            } else {
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#4`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/4')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#5`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/5')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')
            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#6`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/6')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#7`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/7')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#8`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/8')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#9`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/9')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)

          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
              expect(res.body !== undefined, 'https Diagnostics !== null? ').to.be.true
              done()
            }
          })
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Retrieving Event Counters#10`, function (done) {
      if (access_token !== undefined && access_token.length > 0) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/eventcounters/10')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .end(function (err, res) {
            archive.debug(request)
            archive.debug(res)
            archive.debug('---------------')

            if (err) {
              archive.error(err)
              done(err)
            } else {
              track.debug(res.body)
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