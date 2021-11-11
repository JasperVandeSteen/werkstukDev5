const express = require('express')

const app = express()
const bgRouter = express.Router();
const port = 8000

let pgData;

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

    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://postgres:rootUser@localhost:5432/users'

});

async function selectUsers() {
    pgData = await pg.select().table("users");
}


startExpress();
bgRouter.route('/users')
    .get((req, res) => {
        let data = {
            naam: "mienMerk"
        }
        //loadPgData();
        selectUsers();
        res.send(data);
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


function startExpress() {
    app.get('/', (req, res) => {
        res.send('type /pgData to go further...')
    });

    app.use('/pgData', bgRouter);

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}

function loadPgData() {
    client.connect();

    client.query(`Select * from users`, (err, res) => {
        if (!err) {
            //console.log(res.rows);
            pgData = res.rows;
        } else {
            console.log(err.message);
        }
        client.end;
    })
}

function addPgData(body) {
    client.connect();

    client.query(
        `INSERT INTO users(naam, id, email) VALUES ('${body.naam}', gen_random_uuid(), '${body.email}')`,
        (err, res) => {
            console.log(err, res);
            client.end;
        }
    );
}

function updatePgData(body, id) {
    client.connect();

    client.query(
        `UPDATE users SET "naam" = '${body.naam}', "email" = '${body.email}' WHERE "id" = '${id}'`,
        (err, res) => {
            console.log(err, res);
            client.end;
        }
    );
}

function deletePgData(id) {
    client.connect();

    client.query(
        `DELETE FROM users WHERE "id" = '${id}'`,
        (err, res) => {
            console.log(err, res);
            client.end;
        }
    );
}


module.exports = {
    startExpress,
    app,
    port,
    client,
    loadPgData,
    addPgData,
    updatePgData,
    deletePgData,
    pgData
}