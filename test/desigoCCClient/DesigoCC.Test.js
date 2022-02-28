'use strict'
let expect = require('chai').expect
let signalr = require('node-signalr')
console.log(process.env.NODE_ENV)
let log4js = require('log4js')
log4js.configure(require('./log'))
let archive = log4js.getLogger('archive')
let access = log4js.getLogger('access')
let track = log4js.getLogger('test::signalR::DesigoCC.Test')
track.info(`${process.env.NODE_ENV} = process.env.NODE_ENV`)
archive.error(__dirname)

/// ALL THOSE TESTS ARE BASED ON
/// <<Web Service Interface Version 4.1 A6V10470112_en_b_40>>2019-08-27 
/// Siemens Building Technologies
describe(__filename, function () {
  let access_token = undefined

  describe('7.1.1 Logging with Username and Password', function () {
    let request = require('supertest')
    before((done) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      access.debug('before test we build process.env.NODE_TLS_REJECT_UNAUTHORIZED = \'0\'')      
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
            access.error(util.inspect(results.error));
          }
          access_token = results.body.access_token
          access.debug(access_token)
          expect(access_token !== undefined, 'https 7.1.1 Logging with Username and Password PASS? ').to.be.true
          done()
        })
        .catch(err => {
          access.error(err)
          done(err)
        })            
    })

    //7.1.2 SSO Log in


    //7.1.3 Logging out


    // 7.2 Heartbeat Service


    // 7.2.1 Extending the Lifetime of a Session and its Bearer Token


    // 7.3 Event Service

    // 7.3.1 Retrieving a List of Events
    it(`Step#1`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/events')
          .set('Access-Control-Allow-Origin', '*')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + access_token)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https res Events !== null? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
        
      } else {
        done('Error: access_token is empty!')
      }
    })

    // 7.3.2 Creating a Subscription for Events (Obsolete)

    // 7.3.2.1 Push Notification

    // 7.3.3 Creating Channalized Events Subscription

    // 7.3.3.1 Subscription Status Notification

    // 7.3.4 Modifying a Subscription for Events

    // 7.3.5 Deleting a Subscription for Events


    // 7.4 EventsCommands Service
    // 7.4.1 Executing a Command on an Event


    // 7.4.1.1 EventCommandId

    // 7.4.2 Bulk Commanding on Events





    // 7.5 EventCounter Service
    // 7.5.1 Retrieving Event Counters

    // 7.5.2 Creating a Subscription for Event Counters (Obsolete)




    it(`7.5.3 Creating Channalized Event Counters Subscription`, function (done) {
      let requestId = '{38583F83-EA38-4087-82C6-D39C2922C290}'
      let connectionId = guid
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/events')
          .set('Access-Control-Allow-Origin', '*')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + access_token)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https res Events !== null? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })

      } else {
        done('Error: access_token is empty!')
      }
    })


    after(() => {
      access.debug('existing the test case...');
    })
  })


  describe('Connectivity sequence', function () {
    let request = require('supertest')

    before(() => {    
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      access.debug(`process.env.NODE_TLS_REJECT_UNAUTHORIZED = ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`)
    })

    it(`Step#1`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/diagnostics')
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https res Events !== null? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`Step#1`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get('/api/diagnostics')
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https res Events !== null? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })

    after(() => {
      access.debug('existing the signalr test case...')
    })

  })

  
  // 7.6 System Browser Service

  // 7.6.1 Retrieving a List of Views of a System

  // 7.6.2 Retrieving a List of Browser Objects

  // 7.6.3 Searching for Browser Objects

  // 7.6.3.1 Searching with Wildcards
  // 7.6.3.3 Discipline and Objecttype Filters
  // 7.6.4 Search multiple Object Ids
  // 7.6.5 Creating a Subscription for Changes in the System Browser views (Obsolete)
  // 7.6.5.1 Push Notification
  // 7.6.5.2 Distributed System support for subscription

/*
subscribe for notifications by providing a connection ID which it gets after a
connection between Client and server is established. The Client then needs to
implement a function (see signature in respective service chapters) which will be
called from the server in case a notification is due.

*/
  // 7.7 Value Service
  // 7.7.1 Retrieving a Value of an Object or Property
  // 7.7.2 Retrieving Values for a List of Objects or Properties
  // 7.7.3 Creating a Subscription for a Change of a Value (Obsolete)
  // 7.7.3.1 Push Notification
  // 7.7.4 Creating Channalized Value Subscription
  // 7.7.4.1 Subscription Status Notification

  
  // 7.8 Property Value Service
  // 7.8.1 Retrieving Detailed Values for Object or Property Id

  // 7.9 Properties Service
  // 7.9.1 Retrieving Detailed Values for Object or Property Id
  // 7.9.1.1 Detail Request Type
  // 7.9.2 Retrieving Detailed Values for multiple Object or Property Ids bulk interface
  // 7.9.1 Retrieving an Image for a Property

  // 7.10 Command Service
  // 7.10.1 Retrieving a List of Commands for a Provided Property
  // 7.10.2 Retrieving Lists of Commands for a List of Properties



  describe('7.12 History Logs Service', function () {
    let request = require('supertest')

    before(() => {    
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      access.debug(`process.env.NODE_TLS_REJECT_UNAUTHORIZED = ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`)
    })

    let systemId = 1
    it(`7.12.1 Retrieving Log Tables`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/historylogs/${systemId}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            let jsonString = results.body
            let jsonArray = JSON.parse(jsonString)
            access.info(jsonArray)
            expect(jsonArray !== undefined, 'https 7.12.1 Retrieving Log Tables json is valid? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err)
            done(err)
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })

    it(`7.12.2 Retrieving Columns of a Log Table`, function (done) {
      let systemId = 2
      let tableName = 'ActivityLogTable'
        if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/historylogs/${systemId}/${tableName}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            let jsonString = results.body
            let jsonArray = JSON.parse(jsonString)
            access.info(jsonArray)
            expect(jsonArray.length > 0, 'https 7.12.2 Retrieving Columns of a Log Table Length > 0? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })
    
    it(`7.12.3 Retrieving Condition Filter Operators for a Column`, function (done) {
      let systemId = 2
      let tableName = 'ActivityLogTable'
      let columnName = 'LogType'
        if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/historylogs/${systemId}/${tableName}/operators/${columnName}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            let jsonString = results.body
            let jsonObject = JSON.parse(jsonString)
            access.info(jsonObject)
            expect(jsonObject !== null, 'https 7.12.2 Retrieving Columns of a Log Table Length > 0? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })
    
    it(`7.12.4 Retrieving Enum Values for a Column`, function (done) {
      let systemId = 2
      let tableName = 'ActivityLogTable'
      let columnName = 'LogType'
        if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/historylogs/${systemId}/${tableName}/enumvalues/${columnName}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send('')
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            let jsonString = results.body
            let jsonObject = JSON.parse(jsonString)
            access.info(jsonObject)
            expect(jsonObject !== null, 'https 7.12.2 Retrieving Columns of a Log Table Length > 0? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })

    let requestBody = {
      "Parent": [
      "UserName",
      "Workstation",
      "DpeName1",
      "Action",
      "MessageText"
      ],
      "Child": [
      "ParentId",
      "RDbId",
      "RowNum",
      "DpeName",
      "Id",
      "LogType"
      ]
     }

    it(`7.12.5 Retrieving Data for Table`, function (done) {

      let systemId = 2
      let tableName = 'ActivityLogTable'
      let columnName = 'LogType'
        if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .post(`/api/historylogs/${systemId}/${tableName}?size=2&isChildDataRequired=true`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            let jsonString = results.body
            let jsonObject = JSON.parse(jsonString)
            access.info(jsonObject)
            expect(jsonObject !== null, 'https 7.12.5 Retrieving Data for Table? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })

    
    let snapshotId = 'ceffdb59-6b5d4b2a-a3e5-e127867ed299%3afe671773-1d76-4f13-8630-a338263565ca'
    it(`7.12.6 Discarding a Snapshot of a Log Table`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .delete(`/api/historylogs/${systemId}/${tableName}/${snapshotId}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            let jsonString = results.body
            let jsonObject = JSON.parse(jsonString)
            access.info(jsonObject)
            expect(jsonObject.SnapshotId !== null, 'https 7.12.6 Discarding a Snapshot of a Log Table Deleted confirmed with SnapshotId? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
    })


    snapshotId = 'ceffdb59-6b5d4b2a-a3e5-e127867ed299%3afe671773-1d76-4f13-8630-a338263565ca'
    it(`7.12.6.1 Discard Snapshot strategy used by the WSI manager`, function (done) {
        done('You have to wait for 10 min until the WSI deleting the unused snapshot to save memeory!')
    })


    let conditionFilter = '\'Action\'%20=%20%22Add%20Camera'
    it(`7.12.7 Validating Condition Filter`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/historylogs/${systemId}/${tableName}/validateconditionfilter`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== null, 'https 7.12.7 Validating Condition Filter? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.12.8 Retrieving Child Data for a Parent Table    
    snapshotId = '78b71424-bcce-44e1-9d7e-ffdfc11a0179:f6139cbd-5854-467f-be0e-227cab6b88fa'
    let parentId = 235
    it(`7.12.8 Retrieving Child Data for a Parent Table`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .post(`/api/historylogs/${systemId}/${tableName}/validateconditionfilter`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== null, 'https 7.12.8 Retrieving Child Data for a Parent Table? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.12.9 Cancel Report Processing
    systemId = 1
    snapshotId = 'some snapshot Id placed here1234567890'
    it(`7.12.9 Cancel Report Processing`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .post(`/api/historylogs/${systemId}/${snapshotId}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== null, 'https 7.12.9 Cancel Report Processing? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.13 Diagnostics Service
    it(`7.13 Diagnostics Service`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/diagnostics/`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.13 Diagnostics Service? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.14 Language Service
    let username = 'defaultAdmin'
    let password = 'cc'
    it(`7.14 Language Service`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/languages?api_key=${username}:${password} `)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.14 Language Service? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.15 Image Service
    let imageId = 'Evt_Discp_Infrastr_None_001'
    it(`7.15 Image Service`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/images/${imageId}?format=png&width=1&height=1&path=System1:libraries%5CGlobal_Base_HQ_1%5Cicons&encodeAsBase64=true`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.15 Image Service? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })


    //7.16 Tables Service
    let tableName = 'tables'
    let tableEntryId = 'disciplines'
    it(`7.16.1 Retrieving a Table or an Entry of a Table`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`api/tables/${tableName}/${tableEntryId}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.16.1 Retrieving a Table or an Entry of a Table? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.16.2 Retrieving a Subtable of a Table
    let subtableName = 'icons'
    it(`7.16.2 Retrieving a Subtable of a Table`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`api/tables/${tableName}/subtables/${tableEntryId}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.16.2 Retrieving a Subtable of a Table ? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.16.3 Retrieving a Subtable of a Table for given row of table
    tableName = 'categories'
    let rowId = 1
    subtableName = 'colors'
    it(`7.16.3 Retrieving a Subtable of a Table for given row of table`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`api/tables/${tableName}/${rowId}/subtables/${subtableName}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.16.3 Retrieving a Subtable of a Table for given row of table ? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })


    //
    tableName = 'categories'
    it(`7.16.4 Retrieving Subgroups with filter`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`api/tables/${tableName}/subgroups?filter={"0":[0,1],"100":[101,102]}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.16.3 Retrieving a Subtable of a Table for given row of table ? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.16.5 Retrieving Image from Global Text Table
    it(`7.16.5 Retrieving Image from Global Text Table`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`api/tables/${tableName}/subgroups?filter={"0":[0,1],"100":[101,102]}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.16.5 Retrieving Image from Global Text Table? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.17 Systems Service
    it(`Retrieving list of installed languages (same order) as installed in project `, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/systems/languages`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.16.5 Retrieving Image from Global Text Table? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //Retrieving list of all available systems with list of installed languages.
    it(`7.17.2 Retrieving list of all available systems with list of installed languages. `, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/systems`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.17.2 Retrieving list of all available systems with list of installed languages.? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })


    //7.17.3 Retrieving information of a specific system
    let systemid = 1
    it(`7.17.3 Retrieving information of a specific system`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/systems/${systemid}`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.17.3 Retrieving information of a specific system? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.17.4 Retrieving information of a local system
    it(`7.17.4 Retrieving information of a local system`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/ api/systems/local`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.17.4 Retrieving information of a local system? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })

    //7.17.1 Create channelize Systems subscription

    /*
    If subscription response and notifications are needed on signalr channel.
Subscription response will be pushed through notifySubscriptionStatus function
available at client side. Sound changes will be notified via notifySounds.    
*/
    let requestId = '9565ca41-8556-4dbb-94cc-1b89451a5db5'
    let connectionId = 'c6c95ece-133b-480b-af1f067a173e0f5b'
    // it(`7.17.1 Create channelize Systems subscription`, function (done) {
    //   if (access_token !== undefined) {
    //     request('https://desktop-eka5vdd:8443')
    //       .post(`api/sr/systemssubscriptions/channelize/${requestId}/${connectionId}`)
    //       .set('Access-Control-Allow-Origin', '*')
    //       .set('Authorization', `Bearer ${access_token}`)
    //       .send(JSON.stringify(requestBody))
    //       .expect(200)
    //       .then(results => {
    //         if (results.error !== null
    //           && typeof results.error !== 'undefined'
    //           && results.error !== false) {
    //           access.error(util.inspect(results.error));
    //         }
    //         access.info(results.body)
    //         expect(results.body !== undefined, 'https 7.17.1 Create channelize Systems subscription? ').to.be.true
    //         done()
    //       })
    //       .catch(err => {
    //         access.error(err);
    //         done(err);
    //       })
      
    //   } else {
    //     done('Error: access_token is empty!')
    //   }
        
    // })

    //
    //7.17.2 Delete Subscription for a Systems

    //7.17.2.2 Subscription Status Notification



    // 7.18 Products Service
    it(`7.18.1 Retrieving Product Information`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/Products`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.18.1 Retrieving Product Information? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })


    //7.19 Files Service

    // 
    it(`7.19.1 Retrieving Files of specific type`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/files/0?names=entrypage_image.JPG`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.19.1 Retrieving Files of specific type? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })
    //

    // 
    it(`7.19.2 Retrieve Files from system`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/files/1/libraries\BA_Cooling_HQ_1\Symbols\DYN_2D_Chiller_None_Analog_Central_001.ccs`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.19.2 Retrieve Files from system? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })
    //
    // 
    it(`7.19.3 Retrieve Documents from system`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/files/documents/System1.ApplicationView%253AApplicationView.Documents.pdfSample`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.19.3 Retrieve Documents from system? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })
    //

    // 7.20 Graphics Service
    it(`7.20.1 Check if object is graphical`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/graphics/System1:ObjectName`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https 7.20.1 Check if object is graphical? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })
    //
    // 7.20.2 Retrieving graphic item ids
    it(` 7.20.2 Retrieving graphic item ids`, function (done) {
      if (access_token !== undefined) {
        request('https://desktop-eka5vdd:8443')
          .get(`/api/graphics/itemIds/System1:ObjectName`)
          .set('Access-Control-Allow-Origin', '*')
          .set('Authorization', `Bearer ${access_token}`)
          .send(JSON.stringify(requestBody))
          .expect(200)
          .then(results => {
            if (results.error !== null
              && typeof results.error !== 'undefined'
              && results.error !== false) {
              access.error(util.inspect(results.error));
            }
            access.info(results.body)
            expect(results.body !== undefined, 'https  7.20.2 Retrieving graphic item ids? ').to.be.true
            done()
          })
          .catch(err => {
            access.error(err);
            done(err);
          })
      
      } else {
        done('Error: access_token is empty!')
      }
        
    })
    //

    // 7.20.3 Retrieving graphical item

    // 7.21 EventCategorySound Service

    // 7.21.1 Get current event sound

    // 7.21.2 Subscribe for event sound

    // 7.21.3 Delete Subscription for a event sounds changes.

    // 7.21.3.1 Push Notification

    // 7.21.4 Create channelize event sound subscription

    // 7.21.4.1 Subscription Status Notification

    // 7.22 Settings Service

    // 7.22.1 Read setting

    // 7.22.2 Write setting

    // 7.22.3 Delete setting

    // 7.23 Users Service

    // 7.23.1 Change Password

    // 7.24 Scheduler Service

    // 7.24.1 Gets BACnet schedule object based on the schedule object id

    // 7.24.2 Save BACnet schedule values

    // 7.24.3 Save BACnet schedule exceptions

    // 7.24.4 Save BACnet default value for schedule

    // 7.24.5 Retrieve BACnet calendar list for schedule object id

    // 7.24.6 Retrieve calendar object based on calendar object Id

    // 7.24.7 Save BACnet calendar


    // 7.25 Objects Service

    // 7.25.1 Get available Objects types

    // 7.25.2 Create Objects

    // 7.25.3 Delete Objects




    ///
    after(() => {
      access.debug('existing the signalr test case...')
    })

  })

  ///Chapter anex1-1
})