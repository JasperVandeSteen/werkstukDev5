const functions = require("./../index")
const app = require('./../server.js')

const supertest = require('supertest');
const request = supertest(app);

const pg = require('knex')({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/test'
});

describe("Integration test", () => {
    test('full circle', async (done) => {
        try {
            let uuid = null;
            await request.post('/test')
                .send({
                    title: 'test',
                    summary: 'testing'
                })
                .expect(200)
                .then((resp) => resp.body.res)
                .then((res) => {
                    uuid = res[0].uuid
                }).catch((e) => {
                    console.log(e)
                })
            await pg.raw('BEGIN');
            pg.select('*').table("posts").where({
                    uuid
                }).then((rows) => {
                    console.log(rows)
                    expect(rows).toBeInstanceOf(Array);
                    expect(rows.length).toBe(1);
                })
                .then(() => {
                    done();
                })
        } catch (err) {
            throw err;
        } finally {}
    });
});

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