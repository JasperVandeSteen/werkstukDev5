const express = require('express')
const bodyparser = require('body-parser');

const app = express()
const bgRouter = express.Router();
const port = 8000

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

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

let pgData;



startExpress();
bgRouter.route('/users')
    .get((req, res) => {
        loadPgData();
        res.send(pgData);
    })
    .post((req, res) => {
        addPgData(req.body);
    });

bgRouter.route('/users/:id')
    .delete((req, res) => {
        deletePgData(req.params.id);
    })
    .patch((req, res) => {
        updatePgData(req.body, req.params.id);
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
            console.log(res.rows);
            pgData = res.rows;
        } else {
            console.log(err.message);
        }
        client.end;
    })
}

function addPgData(naam, email) {
    client.connect();

    client.query(
        `INSERT INTO users(naam, id, email)VALUES(${naam}, gen_random_uuid(), ${email})`,
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
    port,
    client,
    loadPgData,
    addPgData,
    updatePgData
}