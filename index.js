const express = require('express')

const app = express()
const bgRouter = express.Router();
const port = 8000

const {
    Client
} = require('pg')
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "rootUser",
    database: "postgres"
})

const pg = require('knex')({

    client: 'pg',

    searchPath: ['knex', 'public'],

    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://postgres:rootUser@pg:5432/postgres'

});

let pgData;


// BGROUTING FOR CRUDN ACTIONS ------------------------------------------

startExpress();
bgRouter.route('/users')
    .get((req, res) => {
        getPgData();
        res.send(pgData);
    })
    .post((req, res) => {
        addPgData(req.body);
        res.send("Succesfully added data!");
    });

bgRouter.route('/users/:id')
    .delete((req, res) => {
        deletePgData(req.params.id);
        res.send("Succesfully deleted!");
    })
    .patch((req, res) => {
        updatePgData(req.body, req.params.id);
        res.send("Succesfully updated!");
    });

//---------------------------------------------------------------------


function startExpress() {
    app.get('/', (req, res) => {
        res.send("type /pgData to continiue...")
    });

    app.use('/pgData', bgRouter);

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}

async function createTable() {
    await pg.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            return pg.schema.createTable('users', function (t) {
                t.increments('id').primary();
                t.string("naam", 100);
                t.string("email", 100);
            });
        }
    });
    for (let i = 0; i < 6; i++) {
        await pg.table('users').insert({
            naam: "test" + i,
            email: "test" + 1 + "@test.com"
        });
    }
}
//createTable();

async function getPgData() {
    pgData = await pg.select().table("users");
}

async function addPgData(body) {
    await pg.table('users').insert({
        "naam": body.naam,
        "email": body.email
    });
}

async function updatePgData(body, id) {
    return await pg.table('users').where('id', '=', id).update({
        "naam": "UPDATE",
        "email": "update@update.com"
    })
}

async function deletePgData(id) {
    return await pg.table('users').where('id', '=', id).del();
}


module.exports = {
    startExpress,
    app,
    port,
    client,
    createTable,
    getPgData,
    addPgData,
    updatePgData,
    deletePgData,
    pgData
}