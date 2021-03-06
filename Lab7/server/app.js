// const Redis = require('ioredis');
// const redis = new Redis();

const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const routes = require('./routes');
const cors = require('cors');
app.use(cors());

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
