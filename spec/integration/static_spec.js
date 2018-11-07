const request = require("request");
const server = require("../../src/server");
const base = "http://localhost3000/";
const base2 = "http://localhost3000/about";

describe("routes : static", () => {
    describe("GET /", () => {
        it("should return status code 200 and have 'welcome to bloccit' in the body of the response", () => {
            request.get(base, (err, res, body) => {
                //expect(res.statusCode).toBe(200);
                expect(body).toContain("Welcome 2 Bloccit");
                //done();
            });
        });
        it("should return status code 200 for route /about", () => {
            request.get(base2, (err, res, body) => {
                expect(res.statusCode).toBe(200);
            });
        });
    });
});

