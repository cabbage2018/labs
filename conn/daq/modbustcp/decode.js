const log4js = require('log4js')
const tracer = log4js.getLogger('decode:index')
  /*
    Here support as long as 'LONG' at present, 64bit, 8 bytes, 16 hex digits like '6d 3f 2e 7b f0'
    subInteger means from bit offset to bit length value
    for example, bit offset = 0 and big length =32 means whole INT data type
                 bit offset = [0::31] and bit length = 1 means one single bit position
                 one bit value can be translated into boolean like true or false(syntax with semantic)
          
          datapoint.buffer = Buffer.from(rawdataObj.buffer);
          datapoint.start = (realStart) * / *sizeof(int) / * / 2;
          datapoint.counts = segment.registers * / * sizeof(int) / * / 2;
          datapoint.qualityCode = "0";
          datapoint.value = Number.MIN_VALUE;//NaN;
          datapoint.typeIndicator = "STRING";
  
          -->>
          datapoint.bitstart = 0..31;
          datapoint.bitcounts = 1..32;
    
    ***
    to flexibly handle any cases in work, after consideration I adopted the own way of parse INT/LONG
    that is 'shift' and 'add'
    not the original designed Buffer function (readInt32BE...) BE guess mean Big Endian
    
    now this way I can read 1 word INT from some strange device like Siemens SoftStarter
  
    at first this piece code cannot process the 2 butes INT and the above readInt32BE gave exception
    after check the tracer message on screen I found this issue was caused by Buffer's function
    so when facing bytesArray = [0x01, 0xea], this could be viewed as byte array of word
    I simply move the BE to left: please remember the left most byte owns highest order
    intValue = 0x01 << 0x8 : move the most significant byte to left, that is to implement the BE means
    intValue = 0x01 << 0x8 + 0xea: get the full length value 
  
    actually thus this piece of new code could handle any bytes array until 8 - 64bits LONG for most computer
  
  */
  
  // Here support as long as 'INT' at present, 32bit, 4 bytes, 8 hex digits like '6d 3f 2e 7b f0'
  // Here support as long as 'LONG' at present, 64bit, 8 bytes, 16 hex digits like '6d 3f 2e 7b f0'

/* PRIVATE FUNCTION TO PARSE BITS IN INT OR LONG*/
function tryparseBitsValue(intNumber, bitoffset, bitlength) {
    /// unsigned shift
    var shiftedNumber = intNumber >>> bitoffset;
    var bitmask = 0;
    for (let i = 0; i < bitlength; i = i + 1/*, shiftedNumber >>> 1*/) {
        bitmask |= 0x1 << i;
    }
}
///worst of all mindsphere only defined double/int/boolean/string/timestamp and no long and float at all
function interpret(layout, valbuf){
    if(layout.r > 0 && layout.c > 0&&layout.f > 0&& typeof(layout.type) == 'string' && valbuf.length > 0){
        if(layout.endian.indexOf('BE') >= 0){
            let datapoint = {}
            datapoint.layout = layout
            datapoint.buf = valbuf
            datapoint.qualityCode = 0x0
    
            switch (layout.type.toUpperCase()) {
                case "FLOAT":
                    ///float, as described in IEEE 754 STD.,
                    datapoint._value = valbuf.readFloatBE(0);
                    break;
        
                case "DOUBLE":
                    datapoint._value = valbuf.readDoubleBE(0);
                break;
                
                case "INT":
                    datapoint._value = valbuf.readInt32BE(0)
                break;
        
                case "LONG": 
                    datapoint._value = valbuf.readInt64BE(0)
                break;  
                
                case "BOOLEAN":
                    let _value = valbuf.readInt8(0)
                    datapoint._value = _value === 0 ? false: true;
                break;
                
                case "BITS": 
                    datapoint._value = valbuf.readInt8(0)
                break;
        
                case "TIMESTAMP":
                    datapoint = valbuf.toString('ascii', 0, valbuf.length);/// rather than from an UTC readable string some time it is an int#, oh bad
                break;
                
                case "STRING": 
                    datapoint = valbuf.toString('hex', 0, valbuf.length);
                break;
        
                default:
                    datapoint = valbuf.toString('hex', 0, valbuf.length);
                    datapoint.qualityCode = 0x80ac0000;
                break;
            }
            return datapoint;
        }
    }
}
/**
{
	"GatewaySerialNumber": "a1EXPsAfA8Z",
	"machineId": "2f13442ede974c4b8694c72173e1e8cd",
	"Model": "SIMOCODEPROVPN",
	"timeseries": [
		{
			"_t": "2019-02-10T23:00:00Z",
			"_v": true,
			"_n": "Van",
			"_qc": "0",
			"_id": "E17"
		},
		{
			"_t": "2019-02-14T23:01:00Z",
			"_v": false,
			"_n": "Vbn",
			"_qc": "0X80000000",
			"_id": "enginetemperatureValue2"
		}
	]
}
    **/
function displayCallback(jsonObj){
    console.log(jsonObj)
}
function forge(rawdataObj, layoutObj) {
    let dp = []
    for (let i = 0; i < layoutObj.length; i = i + 1) {
        let layout = layoutObj[i]        
        if(layout.endian){}else{
            layout.endian = 'BE'
        }
        for (let j = 0; j < layoutObj.length; j =j + 1) {
            let _fc = rawdataObj.response._body._fc
            let _start = rawdataObj.request._body._start            
            let _buf = Buffer.from(rawdataObj.response._body._valuesAsBuffer)
            
            if(_fc === layout.f && layout.r >= _start && layout.r + layout.c <= _start + _buf.length / 2){
                let copied = _buf.slice(layout.r - _start, layout.r - _start + layout.c * 2 + 1)
                log.debug(copied.toString('hex'))
                let p = interpret(layout, copied)
                p.timestamp = new Date()
                displayCallback(p)
                dp.push(p)
            }
        }
    }
    return dp;
}
module.exports.forge = forge