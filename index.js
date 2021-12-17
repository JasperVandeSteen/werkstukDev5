const express = require('express')

const app = express()
const bgRouter = express.Router();
const port = 8000

const pg = require('knex')({

    client: 'pg',

    searchPath: ['knex', 'public'],

    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://postgres:rootUser@localhost:5432/postgres'

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

/**
 * Starts up the express server on localhost.
 */
function startExpress() {
    app.get('/', (req, res) => {
        res.send("type /pgData to continiue...")
    });

    app.use('/pgData', bgRouter);

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}

/**
 * Creates a standard table if the database doesn't yet contain one.
 */
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
createTable();

async function getPgData() {
    pgData = await pg.select().table("users");
}

/**
 * Adds an element to the users table
 * @param {*} body the provided body in the POST request
 */
async function addPgData(body) {
    await pg.table('users').insert({
        "naam": body.naam,
        "email": body.email
    });
}

/**
 * Updates the selected table element.
 * @param {*} body the provided body in the PATCH request
 * @param {*} id the id from the link
 * @returns Returns the updated element
 */
async function updatePgData(body, id) {
    return await pg.table('users').where('id', '=', id).update({
        "naam": "UPDATE",
        "email": "update@update.com"
    })
}

/**
 * Deletes a selceted table element.
 * @param {*} id the id from the link
 * @returns Returns the deleted element
 */
async function deletePgData(id) {
    return await pg.table('users').where('id', '=', id).del();
}


module.exports = {
    startExpress,
    app,
    port,
    createTable,
    getPgData,
    addPgData,
    updatePgData,
    deletePgData,
    pgData
}