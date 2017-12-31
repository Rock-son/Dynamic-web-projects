const chai = require("chai"),
      should = chai.should(),
      expect = chai.expect,
      assert = chai.assert,
      sinon = require("sinon"),
      createHash = require("../db/controllers/_createHash");
      

describe("DB controller tests", function() {


    
    
    it("should return a string hashed url when called", function() {

        const logSpy = sinon.spy(),
              data = Date.now().toString() + Math.random().toString(),
              result = createHash("md5", data, logSpy);
        
        logSpy.called.should.be.true;
        assert.typeOf(result, "string","url hash should be a string");
    });

    it("should return a string hashed url w/ 35 < length > 30 when called", function() {

        const data = Date.now().toString() + Math.random().toString(),
              logSpy = sinon.spy(),
              result =  createHash("md5", data, logSpy);
              
        expect(result.length).to.be.at.least(30).to.be.at.most(35);
    });


});