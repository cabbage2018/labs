let assert = require('assert')
let log4js = require('log4js')
log4js.configure(require('../../config/log4js_dev.json'))
let tracer = log4js.getLogger('test::db::nedb')
let db = require('../routes/backend-db/dao')
let fs = require('fs')

describe('backend-db', function () {
  describe('dao', function () {
    describe('#findByPk', function () {
      it('normal', async function () {
        // const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let original_map = new Map([
            ['key1', 'the-one-value'],
            ['second-key', 'value-two'],
            ['somekey', 19870.65432],
            ['anotherkey', 3456789.0987],
        ])
        let orginal_array = Array.from(original_map.entries())
        let dbrecord = await db.Instance.findByPk("l1yFWbotY2dms4tA")
        assert.ok(dbrecord.dataObject !== undefined && dbrecord !== null, "read db record wrong result: empty dataObject field")


        dbrecord.dataObject = orginal_array
        const dbrecord_updated = await db.Instance.update(dbrecord)
        assert.ok(dbrecord_updated !== undefined && dbrecord_updated !== null, "update db record wrong result: dbrecord_updated ")
        tracer.debug("dbrecord_updated: ", dbrecord_updated)
        console.log("this is invisible in test routine.", dbrecord_updated)

        let dbrecord_renew = await db.Instance.findByPk("l1yFWbotY2dms4tA")
        assert.ok(dbrecord_renew.dataObject !== undefined && dbrecord_renew.dataObject !== null, "reread db record wrong result: dbrecord_renew ")
        tracer.debug("dbrecord_renew: ", dbrecord_renew)

        let array_recovered = dbrecord_renew.dataObject
        tracer.debug("array_recovered: ", array_recovered)

        let map_recovered = new Map(dbrecord_renew.dataObject) // since storage doesnot support complex object like Map().
        tracer.debug("map_recovered: ", map_recovered)

        let write_result = fs.writeFileSync('./meta.json', JSON.stringify([...map_recovered]) , 'utf-8')
        assert.ok(write_result === undefined || write_result !== null, "write_result wrong result: write_result ")
        tracer.debug("write_result: ", write_result)


        assert.ok(true, "pass unit test")
      
        
      })
    })
  })
})


describe('backend-db', function () {
  describe('dao', function () {
    describe('#update', function () {
      it('semantics', async function () {
        
        let idString = "l1yFWbotY2dms4tA"
        
        let original_map = new Map([
            ['Vcn', {
              _v: 223.598,
              _t: new Date(),
              _qc: 80089003
            }],
            ['ActivePowerImport1', {
              _v: 8990465.374,
              _t: new Date(),
              _qc: 0
            }],
            ['TariffActiveImport02',  {
              _v: 1987015432.74,
              _t: new Date(),
              _qc: 0
            }],
            ['Tai1', {
              _v: 3456789.0987,
              _t: new Date(),
              _qc: 0
            }],
        ])

        let orginal_array = Array.from(original_map.entries())
        let dbrecord = await db.Instance.findByPk(idString)
        assert.ok(dbrecord.dataObject !== undefined && dbrecord !== null, "read db record wrong result: empty dataObject field")


        dbrecord.dataObject = orginal_array
        const dbrecord_updated = await db.Instance.update(dbrecord)
        assert.ok(dbrecord_updated !== undefined && dbrecord_updated !== null, "update db record wrong result: dbrecord_updated ")

        assert.ok(true, "pass unit test")      
        
      })
    })
  })
})


// describe('backend-db', function () {
//   describe('dao', function () {
//     describe('#update', function () {
//       it('injectmany', async function () {
        
//         let idString = "l1yFWbotY2dmsvtA"
//         let dbrecord = await db.Instance.findByPk(idString)
//         assert.ok(dbrecord.dataObject !== undefined && dbrecord !== null, "read db record wrong result: empty dataObject field")

//         let original_map = new Map()

//         for(var i = 0; i < 45000; i = i + 1){
//           original_map.set( "prompt_variable_" + i, {
//             _v: parseInt(Math.random() * 65535*255 + 1, 10),
//             _t: new Date(),
//             _qc: parseInt(Math.random() * 5, 10)
//           })
//         }

//         assert.ok(original_map.size > 1000, "map size is irrational:")

//         let orginal_array = Array.from(original_map.entries())
//         dbrecord.dataObject = orginal_array

//         const dbrecord_updated = await db.Instance.update(dbrecord)
//         assert.ok(dbrecord_updated !== undefined && dbrecord_updated !== null, "update db record wrong result: dbrecord_updated ")

//         assert.ok(true, "pass unit test")   
        
//       })
//     })
//   })
// })


// describe('backend-db', function () {
//   describe('dao', function () {
//     describe('#access', function () {
//       it('Map', async function () {

//         let idString = "l1yFWbotY2dmsvtA"

//         let dbrecord = await db.Instance.findByPk(idString)
//         assert.ok(dbrecord.dataObject !== undefined && dbrecord !== null, "read db record wrong result: empty dataObject field")
//         let original_map = new Map()

//         for(var i = 0; i < 45000; i = i + 1){
//           original_map.set( "prompt_variable_" + i, {
//             _v: parseInt(Math.random() * 65535*255 + 1, 10),
//             _t: new Date(),
//             _qc: parseInt(Math.random() * 5, 10)
//           })
//         }

//         assert.ok(original_map.size > 1000, "map size is irrational:")

//         let orginal_array = Array.from(original_map.entries())
//         dbrecord.dataObject = orginal_array

//         const dbrecord_updated = await db.Instance.update(dbrecord)
//         assert.ok(dbrecord_updated !== undefined && dbrecord_updated !== null, "update db record wrong result: dbrecord_updated ")

//         assert.ok(true, "pass unit test")   
        
//       })
//     })
//   })
// })

