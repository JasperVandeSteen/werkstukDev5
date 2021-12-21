const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const bgRouter = express.Router();
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const pg = require('knex')({

    client: 'pg',

    searchPath: ['knex', 'public'],

    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://postgres:rootUser@postgres:5432/postgres'

});

let pgData;


// BGROUTING FOR CRUD ACTIONS ------------------------------------------

startRoutes();

// Routes for USERS
bgRouter.route('/users')
    .get((req, res) => {
        getUsers();
        res.send(pgData);
    })
    .post((req, res) => {
        addUser(req.body.naam, req.body.email);
        res.send("Succesfully added data: " + req.body);
    });

bgRouter.route('/users/:id')
    .delete((req, res) => {
        deleteUser(req.params.id);
        res.send("Succesfully deleted!");
    })
    .patch((req, res) => {
        updateUser(req.body, req.params.id);
        res.send("Succesfully updated!");
    });


// Routes for FESTIVALS
bgRouter.route('/festivals')
    .get((req, res) => {
        getFestivals();
        res.send(pgData);
    });
//     .post((req, res) => {
//         addFestival(req.body);
//         res.send("Succesfully added data!");
//     });

// bgRouter.route('/festivals/:id')
//     .delete((req, res) => {
//         deleteFestival(req.params.id);
//         res.send("Succesfully deleted!");
//     })
//     .patch((req, res) => {
//         updateFestival(req.body, req.params.id);
//         res.send("Succesfully updated!");
//     });

//---------------------------------------------------------------------

/**
 * Starts up the express server on localhost.
 */
function startRoutes() {
    app.get('/', (req, res) => {
        res.send("type /pgData to continiue...")
    });

    app.use('/pgData', bgRouter);
}

/**
 * Creates a standard table if the database doesn't yet contain one.
 */
async function createTables() {
    let hadToCreateUsers = false;
    // Create users table
    await pg.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            hadToCreateUsers = true;
            return pg.schema.createTable('users', function (t) {
                t.increments('id').primary();
                t.string("naam", 100);
                t.string("email", 100);
            });
        }
    });
    if (hadToCreateUsers) {
        for (let i = 0; i < 6; i++) {
            await pg.table('users').insert({
                naam: "test" + i,
                email: "test" + 1 + "@test.com"
            });
        }
    }

    let hadToCreateFestivals = false;
    // Create festivals table
    await pg.schema.hasTable('festivals').then(function (exists) {
        if (!exists) {
            hadToCreateFestivals = true;
            return pg.schema.createTable('festivals', function (t) {
                t.increments('id').primary();
                t.string("naam", 100);
                t.string("genre", 100);
                t.json('guestList').nullable();
            });
        }
    });
    if (hadToCreateFestivals) {
        await pg.table('festivals').insert({
            naam: "Pukkelpop",
            genre: "Pop",
            guestList: JSON.stringify(pg.select().table("users"))
        });

        await pg.table('festivals').insert({
            naam: "Tommorowland",
            genre: "EDM",
            guestList: JSON.stringify(pg.select().table("users"))
        });
    }
}
createTables();


/**
 * USER sided CRUD actions
 */
async function getUsers() {
    pgData = await pg.select().table("users");
}

/**
 * Adds an element to the users table
 * @param {*} body the provided body in the POST request
 */
async function addUser(naam, email) {
    await pg.table('users').insert({
        "naam": naam,
        "email": email
    });
}

/**
 * Updates the selected table element.
 * @param {*} body the provided body in the PATCH request
 * @param {*} id the id from the link
 * @returns Returns the updated element
 */
async function updateUser(body, id) {
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
async function deleteUser(id) {
    return await pg.table('users').where('id', '=', id).del();
}


/**
 * FESTIVAL sided CRUD actions
 */
async function getFestivals() {
    pgData = await pg.select().table("festivals");
}

/**
 * Adds an element to the users table
 * @param {*} body the provided body in the POST request
 */
async function addFestival(body) {
    await pg.table('festivals').insert({
        "naam": body.naam,
        "genre": body.genre,
        "guestList": null
    });
}

/**
 * Updates the selected table element.
 * @param {*} body the provided body in the PATCH request
 * @param {*} id the id from the link
 * @returns Returns the updated element
 */
async function updateFestival(body, id) {
    return await pg.table('festivals').where('id', '=', id).update({
        "naam": "UPDATE FESTIVAL",
        "genre": "UPDATE GENRE",
        "guestList": null
    })
}

/**
 * Deletes a selceted table element.
 * @param {*} id the id from the link
 * @returns Returns the deleted element
 */
async function deleteFestival(id) {
    return await pg.table('festivals').where('id', '=', id).del();
}


module.exports = {
    startRoutes,
    app,
    createTables,
    getUsers,
    getFestivals,
    addUser,
    addFestival,
    updateUser,
    updateFestival,
    deleteUser,
    deleteFestival,
    pgData
}