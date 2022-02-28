'use strict'
const log4js = require('log4js')
const log = log4js.getLogger('conn::daq::opcua:inventory')
const {
    AttributeIds,
    OPCUAClient,
    TimestampsToReturn,
} = require("node-opcua")

async function acquire(endpointUrl, nodeArray, bulkSize = 1){
    var arr = [];
    for (var i = 0; i < nodeArray.length/*SOME DEVICE LIKE SIMOCODE PROV PN HAS VERY SMALL LIMIT; but SCADA has bigger*/; i += 1){
        arr.push({nodeId: nodeArray[i].nodeid, attributeId: AttributeIds.Value});
    }

    let promisePhysicalLayer = new Promise(function (resolve, reject) {
        try {
            const client = OPCUAClient.create({
                endpoint_must_exist: false,
                connectionStrategy: {
                    maxRetry: 5,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                }
            })
            client.on("backoff", () => {
                reject('backoff')
                log.debug("retrying connection")
            })
            client.on("backoff", (retry, delay) => {
				reject({ r: retry, d: delay, t: 'backoff' })
			})
			client.on("error", (e) => {
				reject(e)
			})

            await client.connect(endpointUrl)
            const session = await client.createSession();
            log.debug(`session created`)
    
            let responseValues = []
            responseValues['url'] = endpointUrl
            responseValues['nodes'] = nodeArray    
            if (bulkSize > 1){

                const BATCH_SIZE = bulkSize;
                for(var i = 0; i < arr.length / BATCH_SIZE; i += 1){
                    const start = i * BATCH_SIZE
                    const stop = (i === arr.length / BATCH_SIZE) ? arr.length : (i + 1) * BATCH_SIZE
                    var t = await session.readVariableValue(arr.slice(start, stop));//read
                    responseValues.push(t.values)
                }
                resolve(responseValues)

            } else {
                // acquire1by1(desc, arr, callback);
                /// assume they are queried in order...
                for(var i = 0; i < arr.length; i ++ ){
                    const responseValue = await session.read(arr[i])
                    responseValues.push(responseValue)

                    // for (var i = 0; i < spaceConfigure.nodeIds.length; i = i + 1) {
                    //     let resp = await session.readVariableValue(spaceConfigure.nodeIds[i].address)
                    //     responseValues.push(resp)
                    //     log.debug('----------------------------------------')
                    //     log.debug(resp.value.Variant.value)
                    //     log.debug(resp.value.statusCode.ConstantStatusCode._name)
                    //     log.debug(resp.value.serverTimestamp)
                    //     log.debug('----------------------------------------')
                    // }

                }
                resolve(responseValues)
            }

            // const browseResult = await session.browse("RootFolder");    
            // log.debug(browseResult.references.map((r) => r.browseName.toString()).join("\n"));    
            // const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
            // log.debug(` value = ${dataValue.value.value.toString()}`);
                
            log.debug(" closing session")
            await session.close()
            await client.disconnect()
        }
        catch (err) {
            if (session) {
                await session.close()
                session = null
            }
            if (client) {
                await client.disconnect()
                client = null
            }
            reject(err)
            log.debug("Error !!!", err)
        }
	})
	return promisePhysicalLayer
}

module.exports.acquire = acquire
//process.exit(-1)
/*
    BE VERT CAREFUL ABOUT THE BULK SIZE
	EACH OPC UA SERVER HAS ITS OWN MAXIMUM DATA POINTS LIMIT
	FOR EXAMPLE BULK OF SIMOCODE = 130
*/
async function acquireBulk(description, arr, callback){
}
/*	
	MOST STABLE VERSION, CAN DEAL WITH ANY OPC UA SERVER'S CAPABILITY	
*/
async function acquire1by1(description, arr, callback){
}
/*
    basically there are two ways of querying data
    bulk mode
    discrete datapoint address
*/

async function runOnce() {
    let datasource = [
        {
            addr: "ns=2;i=1039"
        }, {
            addr: "ns=2;s=107"
        }
    ]
    acquire(datasource, 124)
        .then(async (responseValues) => {
            log.debug(responseValues)
        })
        .catch((err) => {
            // South-bound machine hardware failure
            log.fatal(err)
        })
}

/** 
{
    "item_id": "20f82405-dceb-46ba-969c-d501ce86d683",>>
    "timestamp": "2021-03-19T04:21:35+01",>>
    "count": 69,
    "total": 69,
    "_embedded": {
        "item": [{
            "internal_name": "StatusValues/Diagnositic/Diag_CB/Diag_Status/Main_PositionInFrame",>>
            "name": "circuit_breaker_position",>>
            "id": -1,
            "display_name": "Position of circuit breaker",
            "display_value": "Test position",
            "value": "2",>>
            "unit": "",>>
            "quality": "valid">>
        }, {
            "internal_name": "StatusValues/Diagnositic/Diag_CB/Diag_Status/Main_SwitchStatus",
            "id": -1,
            "display_name": "Switch",
            "display_value": "is switched off",
            "value": "1",
            "unit": "",
            "quality": "valid"
        }, {
            "internal_name": "StatusValues/Diagnositic/Diag_CB/Diag_Status/Main_CyclicDataTransfer",
            "id": -1,
            "display_name": "Communication",
            "display_value": "Data exchange active",
            "value": "0",
            "unit": "",
            "quality": "valid"
...
        }]
    }
}
*/
