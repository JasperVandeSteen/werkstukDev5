const helpers = require("./../helpers")
const functions = require("./../index")

const request = require('supertest');

describe("Unit Tests", () => {})

describe("CRUD function tests", () => {
    it('tests if connection to endpoint is successful', async () => {
        const response = await request(functions.app).get('/pgData/users');
        expect(response.statusCode).toEqual(200);
    });

    it('tests PATCH request', async () => {
        const response = await request(functions.app).patch('/pgData/users/2');
        expect(response.statusCode).toEqual(200);
        //expect(response.body.status).toBe("Succesfully updated!");
    });

    it('tests DELETE request', async () => {
        const response = await request(functions.app).delete('/pgData/users/3');
        expect(response.statusCode).toEqual(200);
        //expect(response.body.status).toBe("Succesfully deleted!");
    });
})