const users = require('../db/users.json');

const jwt = require("jsonwebtoken");

require('dotenv').config();

const generateToken = user => jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1m"})

const index = (req, res) => {

    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);

    if (!user) { 
        res.format({
            html: () => {
                res.send(`<h1>User non trovato</h1>`)
            },
            json: () => {
                res.status(404).json({
                    status: 404,
                    error:'User non trovato'
                });
            }
        })
    }

    const token = generateToken(user);

    res.format({
        html: () => {
            res.send(token);
        },
        json: () => {
            res.json({
                username,
                password,
                token
            });
        }
    })
}

module.exports = {
    index
}