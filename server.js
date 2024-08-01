#!/usr/bin/env node
'use strict';
const app = require('express')();
const params = require('./src/params');
const compress = require('./src/compress');
const bypass = require('./src/bypass');
const shouldCompress = require('./src/shouldCompress');

const PORT = process.env.PORT || 8080;

app.get('/compress', params, (req, res) => {
  if (shouldCompress(req)) {
    compress(req, res);
  } else {
    bypass(req, res, req.params.buffer);
  }
});
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
