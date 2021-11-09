const {
    test,
    expect
} = require("@jest/globals");
const {
    any
} = require("expect");
const {
    checkBody,
    checkStringLength
} = require("./../index")

const helpers = require("./../index")

describe("Express function tests", () => {
    test("check function call", () => {
        expect(helpers.startExpress()).toMatch("JA");
    })
})