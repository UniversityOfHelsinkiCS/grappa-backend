var request = require("request");
var expect = require("chai").expect;

describe('app', function() {
    var url = "http://localhost:9876"; 

    it('loads', function() {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
});
