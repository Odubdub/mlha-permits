const express = require('express');
const app = express();

const cors = require('cors');
const connectDB = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use('/', require('./routes/route'));

const port = 4444;
const server = app.listen(
  port,
  console.log(`App listining in port ${port} - http://localhost:${port}`)
);

module.exports = { app, server };
