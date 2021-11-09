const helpers = require("./../index")

describe("Express function tests", () => {
    test("check function call", () => {
        expect(helpers.startExpress()).toMatch("JA");
    })
})