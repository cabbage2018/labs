'use strict'
const fs = require("fs");
let crypto = require('crypto')
const path = require("path");
// var chai = require('chai');
let expect = require('chai').expect
describe(__filename, function () {
  describe('encrypto as this', function () {
    // 对称性加密
    console.log(__dirname)
    before(() => {
    })

    it(`ciphered & de-ciphered blowfish`, function () {
      // let key = fs.readFileSync(path.join(__dirname, "/rsa_private.key")).toString('ascii');
      let text = 'hello test'
      // 加密
      let cipher = crypto.createCipher('blowfish', '79fc3471-6f63-4b40-bd73-37281747019c');
      cipher.update(text);
      // final 方法不能链式调用
      let result = cipher.final("hex");
      console.log(result); 
      // 解密
      let decipher = crypto.createDecipher('blowfish', '79fc3471-6f63-4b40-bd73-37281747019c');
      decipher.update(result, "hex");
      let data = decipher.final("utf8");
      console.log(data); // hello
      expect(data, `expect${data} to equal ${text}`).to.equal(text)
    })

    it(`ciphered & de-ciphered aes192`, function () {
      let duo = 'aes192 test'
      let cipher = crypto.createCipher('aes192', '79fc3471-6f63-4b40-bd73-37281747019c')
      let crypted = cipher.update(duo, 'utf8', 'hex')
      console.log(crypted)
      let decipher = crypto.createDecipher('aes192', '79fc3471-6f63-4b40-bd73-37281747019c');
      let decrypted = decipher.update(crypted, 'hex', 'utf8');
      console.log(decrypted)
      expect(decrypted, `expect${decrypted} to equal ${duo}`).to.equal(duo)
    })

    it(`ciphered & de-ciphered aes-128-ecb`, function () {
      let duo = 'aes-128-ecb test'
      let cipher = crypto.createCipher('aes-128-ecb', '79fc3471-6f63-4b40-bd73-37281747019c')
      let crypted = cipher.update(duo, 'utf8', 'hex')
      console.log(crypted)
      let decipher = crypto.createDecipher('aes-128-ecb', '79fc3471-6f63-4b40-bd73-37281747019c');
      let decrypted = decipher.update(crypted, 'hex', 'utf8');
      console.log(decrypted)
      expect(decrypted, `expect${decrypted} to equal ${duo}`).to.equal(duo)
    })

    it(`de-ciphered aes-256-cbc`, function () {
      let duo = 'aes-256-cbc test'
      let cipher = crypto.createCipher('aes-256-cbc', '79fc3471-6f63-4b40-bd73-37281747019c')
      let crypted = cipher.update(duo, 'utf8', 'hex')
      console.log(crypted)
      let decipher = crypto.createDecipher('aes-256-cbc', '79fc3471-6f63-4b40-bd73-37281747019c');
      let decrypted = decipher.update(crypted, 'hex', 'utf8');
      console.log(decrypted)
      expect(decrypted, `expect${decrypted} to equal ${duo}`).to.equal(duo)
    })

    it(`de-ciphered aes-256-cbc, with filename`, function () {
      let duo = __filename
      let cipher = crypto.createCipher('aes-256-cbc', '79fc3471-6f63-4b40-bd73-37281747019c')
      let crypted = cipher.update(duo, 'utf8', 'hex')
      console.log(crypted)
      let decipher = crypto.createDecipher('aes-256-cbc', '79fc3471-6f63-4b40-bd73-37281747019c');
      let decrypted = decipher.update(crypted, 'hex', 'utf8');
      console.log(decrypted)
      expect(decrypted, `expect${decrypted} to equal ${duo}`).to.equal(duo)

    })

    after(() => {      
      setTimeout(() => {console.log('Test completed finished.')}, 1000)
    })



  })
})