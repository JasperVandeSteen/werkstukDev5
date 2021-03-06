const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const bgRouter = express.Router();

// create application/json parser
let jsonParser = bodyParser.json()

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
        getUsers().then(res.send(pgData));
    })
    .post(jsonParser, (req, res) => {
        addUser(req.body.naam, req.body.email);
        res.send("Succesfully added data: " + req.body.naam + " & " + req.body.email);
    });

bgRouter.route('/users/:id')
    .get((req, res) => {
        getUser(req.params.id).then(res.send(pgData));
    })
    .delete((req, res) => {
        deleteUser(req.params.id);
        res.send("Succesfully deleted!");
    })
    .patch(jsonParser, (req, res) => {
        updateUser(req.body.naam, req.body.email, req.params.id);
        res.send("Succesfully updated!");
    });

// Routes for FESTIVALS
bgRouter.route('/festivals')
    .get((req, res) => {
        getFestivals().then(res.send(pgData));
    }).post(jsonParser, (req, res) => {
        addFestival(req.body.naam, req.body.genre, req.body.guestList);
        res.send("Succesfully added data!");
    });

bgRouter.route('/festivals/:id')
    .get((req, res) => {
        getFestival(req.params.id).then(res.send(pgData));
    })
    .patch(jsonParser, (req, res) => {
        updateFestival(req.body.naam, req.body.genre, req.body.guestList, req.params.id);
        res.send("Succesfully updated!");
    })
    .delete((req, res) => {
        deleteFestival(req.params.id);
        res.send("Succesfully deleted!");
    });

//---------------------------------------------------------------------

/**
 * Starts up the express server on localhost.
 */
function startRoutes() {
    app.get('/', (req, res) => {
        res.send("type /pgData + /users or /festivals to continiue...")
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

    // Create festival table
    await pg.schema.hasTable('festivals').then(function (exists) {
        if (!exists) {
            return pg.schema.createTable('festivals', function (t) {
                t.increments('id').primary();
                t.string("naam", 100);
                t.string("genre", 100);
                //t.json('guestList').nullable();
                t.integer('guestList', 1).unsigned().references('id').inTable('users');
            });
        }
    });

    if (hadToCreateUsers) {
        console.log("adding data to database");
        for (let i = 0; i < 6; i++) {
            await pg.table('users').insert({
                naam: "test" + (i + 1),
                email: "test" + 1 + "@test.com"
            });
        }

        await pg.table('festivals').insert({
            naam: "Pukkelpop",
            genre: "Pop",
            guestList: 1
        });

        await pg.table('festivals').insert({
            naam: "Tommorowland",
            genre: "EDM",
            guestList: 1
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
    if (naam == null || email == null || naam == undefined || email == undefined) {
        naam = "STANDARD VALUE";
        email = "STANDARD@VALUE.COM";
    }
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
async function updateUser(naam, email, id) {
    if (naam == null || email == null || naam == undefined || email == undefined) {
        naam = "STANDARD VALUE";
        email = "STANDARD@VALUE.COM";
    }
    return await pg.table('users').where('id', '=', id).update({
        "naam": naam,
        "email": email
    })
}

/**
 * Deletes a selceted table element.
 * @param {*} id the id from the link
 * @returns Returns the deleted element
 */
async function deleteUser(id) {
    return await pg.table('users').where('id', '=', id).del();
    //return await pg.raw('DROP TABLE users CASCADE');
}

/**
 * Deletes a selceted table element.
 * @param {*} id the id from the link
 * @returns Returns the selected element by id
 */
async function getUser(id) {
    pgData = await pg.select().table("users").where('id', '=', id);
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
async function addFestival(naam, genre, guestList) {
    if (naam == null || naam == undefined) naam = "STANDAARD WAARDE"
    if (genre == null || genre == undefined) genre = "STANDAARD WAARDE"
    if (guestList == null || guestList == undefined) guestList = "STANDAARD WAARDE"
    await pg.table('festivals').insert({
        "naam": naam,
        "genre": genre,
        "guestList": guestList
    });
}

/**
 * Updates the selected table element.
 * @param {*} body the provided body in the PATCH request
 * @param {*} id the id from the link
 * @returns Returns the updated element
 */
async function updateFestival(naam, genre, guestList, id) {
    if (naam == null || naam == undefined) naam = "STANDAARD WAARDE"
    if (genre == null || genre == undefined) genre = "STANDAARD WAARDE"
    if (guestList == null || guestList == undefined) guestList = "STANDAARD WAARDE"
    return await pg.table('festivals').where('id', '=', id).update({
        "naam": naam,
        "genre": genre,
        "guestList": guestList
    })
}

/**
 * Deletes a selceted table element.
 * @param {*} id the id from the link
 * @returns Returns the deleted element
 */
async function deleteFestival(id) {
    return await pg.table('festivals').where('id', '=', id).del();
    //return await pg.raw('DROP TABLE festivals CASCADE');
}

/**
 * Adds an element to the users table
 * @param {*} id the provided id in the GET request
 * @returns Returns the selected element by id
 */
async function getFestival(id) {
    pgData = await pg.select().table("festivals").where('id', '=', id);
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