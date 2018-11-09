const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Rule = require("../../src/db/models").Rule;

describe("routes : topics", () => {

    beforeEach((done) => {
        this.rule;
        sequelize.sync({force: true}).then((res) => {
  
            Rule.create({
                title: "JS Frameworks",
                description: "Rules"
            })
            .then((rule) => {
                this.rule = rule;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });
  

    describe("GET /topics", () => {
        request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(err).toBeNull();
            expect(body).toContain("Rules");
            expect(body).toContain("JS Frameworks");
            done();
        });
    });
});