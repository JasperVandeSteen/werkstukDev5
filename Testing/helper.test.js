const helpers = require("./../helpers")
const functions = require("./../index")

const request = require('supertest');

describe("Express function tests", () => {
    const port = functions.port.toString();
    const pgPort = functions.client.port.toString();
    test("check if pg and localhost port differ", () => {
        expect(port).not.toMatch(pgPort);

        expect(helpers.checkStringLength(port, 4)).toMatch(port);
        expect(helpers.checkStringLength(pgPort, 4)).toMatch(pgPort);
    })
})

it('tests if connection to endpoint is successful', async () => {
    const response = await request(functions.app).get('/pgData/users');
    expect(response.statusCode).toEqual(200);
    expect(response.body.naam).toBe("mienMerk");
});