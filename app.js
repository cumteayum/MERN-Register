const express = require('express');
const hbs = require('hbs');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('./routes/router');

app.use(router);
app.use(express.static('public'));
app.set('view engine', 'hbs');


app.listen(5000, () => console.log('http://localhost:3000/'));