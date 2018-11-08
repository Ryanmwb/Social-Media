const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {
    describe("GET /", () => {
        it("should return status code 200 and have 'welcome to bloccit' in the body of the response", () => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                console.log(`Err: ${err}`)
                console.log("html Body below...")
                console.log(body);
                expect(body).toContain("Welcome 2 Bloccit");
                done();
            });
        });
    });
});