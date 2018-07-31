const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const Sequelize = require('sequelize');
const sequelize = new Sequelize('employees_demo', 'wondo', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// app.use((req, res, next) => {
//     req.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Header', 'Origin, X-Requested-Width, Content-Type, Accept')
//     next()
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

const accounts = sequelize.define('accounts', {
    'email': {
        type: Sequelize.STRING,
        primaryKey: true
    },
    'password': Sequelize.STRING,
    'password_salt': Sequelize.STRING,
    'first_name': Sequelize.STRING,
    'last_name': Sequelize.STRING
}, {
    freezeTableName: true
})

app.get('/', (req, res) => {
    res.send('Authentication API')
})

app.get('/accounts/register', (req, res) => {
    accounts.findAll().then(accounts => {
        res.json(accounts);
    })
})

app.post('/accounts/register', (req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            accounts.create({
                    email: req.body.email,
                    password: hash,
                    password_salt: salt,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                })
                .then(newAccount => {
                    res.json({
                        "status": "insert account data success",
                        "data": newAccount
                    })
                })
        })
    })
})

app.listen(3000, () => console.log('App listen on localhost 3000'));