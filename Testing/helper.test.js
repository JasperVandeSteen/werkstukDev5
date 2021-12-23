const functions = require("./../index")
const supertest = require('supertest');

describe("user CRUD function tests", () => {
    it('tests if connection to endpoint is successful', async () => {
        const response = await supertest(functions.app).get('/pgData/users');
        expect(response.statusCode).toEqual(200);
    });

    it('test GET request', async () => {
        const response = await supertest(functions.app).get('/pgData/users/1');
        expect(response.statusCode).toEqual(200);
    });

    it('tests PATCH request', async () => {
        const response = await supertest(functions.app).patch('/pgData/users/2');
        expect(response.statusCode).toEqual(200);
        //expect(response.body.status).toBe("Succesfully updated!");
    });

    it('tests DELETE request', async () => {
        const response = await supertest(functions.app).delete('/pgData/users/3');
        expect(response.statusCode).toEqual(200);
        //expect(response.body.status).toBe("Succesfully deleted!");
    });
})

describe("festivals CRUD function tests", () => {
    it('tests if connection to endpoint is successful', async () => {
        const response = await supertest(functions.app).get('/pgData/festivals');
        expect(response.statusCode).toEqual(200);
    });

    it('tests POST request', async () => {
        const response = await supertest(functions.app).post('/pgData/festivals');
        expect(response.statusCode).toEqual(200);
    });

    it('tests PATCH request', async () => {
        const response = await supertest(functions.app).patch('/pgData/festivals/2');
        expect(response.statusCode).toEqual(200);
        //expect(response.body.status).toBe("Succesfully updated!");
    });

    it('tests DELETE request', async () => {
        const response = await supertest(functions.app).delete('/pgData/festivals/2');
        expect(response.statusCode).toEqual(200);
    });
})