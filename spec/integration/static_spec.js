const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const base2 = "http://localhost:3000/marco";

describe("routes : static", () => {

//#1
  describe("GET /", () => {

//#2
    it("should return status code 200", (done) => {
//#3
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
//#4
        done();
      });
    });
    it("should return status code 200.  Should accept get request to /marco", (done) => {
        request.get(base2, (err, res, body) => {
            expect(res.statusCode).toBe(200)

            done();
        });
    });
  });
});

