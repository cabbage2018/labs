'use strict'
const expect = require('chai').expect;
let soap = require('soap');

// ForexRmbRateWebService
// WeatherWebService
/*
WebXml.com.cn 天气预报 Web 服务，数据每2.5小时左右自动更新一次，准确可靠。包括 340 多个中国主要城市和 60 多个国外主要城市三日内的天气预报数据。
此天气预报Web Services请不要用于任何商业目的，若有需要请联系我们，欢迎技术交流。 QQ：8409035
使用本站 WEB 服务请注明或链接本站：http://www.webxml.com.cn/ 感谢大家的支持！
通知：天气预报 WEB 服务如原来使用地址 http://www.onhap.com/WebServices/WeatherWebService.asmx 的，请改成现在使用的服务地址 http://www.webxml.com.cn/WebServices/WeatherWebService.asmx ，重新引用即可。

支持下列操作。有关正式定义，请查看服务说明。
getSupportCity
查询本天气预报Web Services支持的国内外城市或地区信息
输入参数：byProvinceName = 指定的洲或国内的省份，若为ALL或空则表示返回全部城市；返回数据：一个一维字符串数组 String()，结构为：城市名称(城市代码)。
*/

describe('ForexRmbRate', function () {
  describe('WebService wsdl', function () {
    before(()=> {
      console.log('should print before test')
    });

    it('Weather forecast by city name chars', function (done) {
      let options1_1 = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <getSupportCity xmlns="http://WebXml.com.cn/">
            <byProvinceName>SHANGHAI</byProvinceName>
          </getSupportCity>
        </soap:Body>
      </soap:Envelope>`
      let url = `http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?WSDL`;
      var args= {
        'theCityName': '北京',
      };

      soap.createClient(url, options1_1, function(error, client) {
        if(error) {
          console.log(error)
          done(error);
        }
        // console.log(client)
        client.getWeatherbyCityName(args, function(err, result) {
          if(err) {
            console.log(err)
            done(err);
            // process.exit(10)
          }
          // console.log(result)
          expect(result !== undefined, 'config.host is an valid ip addressss?').to.be.true
          done();
        });
      });
    });

    after(()=> {
      console.log('existing the test case...');
    });
  });
});
