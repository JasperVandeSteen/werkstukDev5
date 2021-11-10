const helpers = require("./../helpers")
const functions = require("./../index")

describe("Express function tests", () => {
    const port = functions.port.toString();
    const pgPort = functions.client.port.toString();
    test("check if pg and localhost port differ", () => {
        expect(port).not.toMatch(pgPort);

        expect(helpers.checkStringLength(port, 4)).toMatch(port);
        expect(helpers.checkStringLength(pgPort, 4)).toMatch(pgPort);
    })
})