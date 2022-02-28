'use strict'
const expect = require('chai').expect;
let soap = require('soap');

let wsdlOptions1_2 = 
` <?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <qqCheckOnline xmlns="http://WebXml.com.cn/">
      <qqCode>59495466</qqCode>
    </qqCheckOnline>
  </soap12:Body>
</soap12:Envelope>`

describe('Webservice', function () {
  describe(' wsdl', function () {
    before(()=> {
      console.log('should print before test')
    });

    it('must connect WebXml.com.cn', function (done) {
      let options1_1 = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <qqCheckOnline xmlns="http://WebXml.com.cn/">
            <qqCode>59495466</qqCode>
          </qqCheckOnline>
        </soap:Body>
      </soap:Envelope>`
      let url = `http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?WSDL`;
      var args= {
        'qqCode': '59495466',
        // 'Host':'www.webxml.com.cn',
        // 'Content-Type': 'application/soap+xml; charset=utf-8',
        // 'Content-Length': wsdlOptions.length,
      };
      soap.createClient(url, options1_1, function(error, client) {
        if(error) {
          console.log(error)
          done(error);
        }
        // console.log(client)
        client.qqCheckOnline(args, function(err, result) {
          if(err) {
            console.log(err)
            // done(err);
            // process.exit(10)
          }
          console.log(result)
          expect(result !== undefined, 'config.host is an valid ip addressss?').to.be.true
          done();
        });
      });
    });

  // it('connect soap qqCode', function (/*done*/) {
  //   let url = `http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?WSDL`;
  //   let options1_1 = `<?xml version="1.0" encoding="utf-8"?>
  //   <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  //     <soap:Body>
  //       <qqCheckOnline xmlns="http://WebXml.com.cn/">
  //         <qqCode>59495466</qqCode>
  //       </qqCheckOnline>
  //     </soap:Body>
  //   </soap:Envelope>`
  //   let args = {
  //     'qqCode': '59495466'
  //   }

  //   soap.createClientAsync(url, options1_1).then((client) => {
  //     return client.qqCheckOnline(args)
  //   }).then((err, result) => {
  //     if(err) {
  //       console.log(err)
  //       // done(err)
  //       process.exit(10)
  //     }

  //     console.log(result)
  //     expect(result !== undefined, 'options might be wrong?').to.be.true
  //     // done()
  //     process.exit(20)
  //   });
  //   })
    // soap.createClient(url, wsdlOptions, function(err, client) {
    //   if(err!==null){
    //     console.log(err)
    //   }
    //   // client.setSOAPAction(url);
    //   client.MyService(args, function(err,result) {
    //     if(err!== null){
    //       console.log(err);
    //     }
    //     console.log (result);
    //     done();
    // });
    // });
    

    // it('connect soap sync mode', function (/*done*/) {
    //   let url = `http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?WSDL`;
    //   let args = {
    //     'qqCode': '59495466'
    //   };
    //   let options1_1 = `<?xml version="1.0" encoding="utf-8"?>
    //   <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    //     <soap:Body>
    //       <qqCheckOnline xmlns="http://WebXml.com.cn/">
    //         <qqCode>59495466</qqCode>
    //       </qqCheckOnline>
    //     </soap:Body>
    //   </soap:Envelope>` 
    //   soap.createClient(url, options1_1, function(err, client) {
    //       client.qqCheckOnline(args, function(err, result) {
    //         if(err) {
    //           console.log(err);
    //         } else {
    //           console.log(result);
    //           expect(result !== undefined, 'options might be wrong?').to.be.true

    //         }
    //       });
    //   });
    // })

    after(()=> {
      console.log('existing the test case...');
    });
  });
});



  
  /*
  ————————————————
  版权声明：本文为CSDN博主「acproject」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
  原文链接：https://blog.csdn.net/acproject/article/details/52718776
  */