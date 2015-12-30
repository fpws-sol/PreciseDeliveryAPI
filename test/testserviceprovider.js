var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var getUsers = require('../serviceprovider');

describe("Routes", function() {
  describe("GET Users", function() {

      it("should respond", function() {
        var req,res,spy;

        req = res = {};
        spy = res.send = sinon.spy();

        serviceprovider(req, res);
        expect(spy.calledOnce).to.equal(true);
      });     

  });
});