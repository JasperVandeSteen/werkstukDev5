const express = require('express')
const app = express()
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



function startExpress() {
    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}
startExpress();

function connectToPg() {
    client.connect();

    client.query(
        "INSERT INTO users(naam, id, email)VALUES('John Doe', gen_random_uuid(), 'john@doe.com')",
        (err, res) => {
            console.log(err, res);
            client.end();
        }
    );

    client.query(`Select * from users`, (err, res) => {
        if (!err) {
            console.log(res.rows);
        } else {
            console.log(err.message);
        }
        client.end;
    })
}
connectToPg();


module.exports = {
    startExpress,
    port,
    client,
    connectToPg
}