#!/usr/bin/env node
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post('/compress', authenticate, params, async (req, res) => {
  try {
    const response = await axios.get(req.params.url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Set necessary params for compress function
    req.params.originSize = buffer.length;
    req.params.originType = response.headers['content-type'];

    compress(req, res, buffer);
  } catch (error) {
    // Fallback to sending the original image if fetching or compression fails
    if (error.response) {
      // Error with the response from the original URL
      res.setHeader('content-type', error.response.headers['content-type']);
      res.setHeader('content-length', error.response.data.length);
      res.status(200).send(Buffer.from(error.response.data));
    } else {
      // General error
      res.status(500).send('Error fetching or compressing the image');
    }
  }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
