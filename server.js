#!/usr/bin/env node
'use strict';
const express = require('express');
const request = require('request');
const authenticate = require('./src/authenticate');
const params = require('./src/params');
const compress = require('./src/compress');
const shouldCompress = require('./src/shouldCompress');

const app = express();
const PORT = process.env.PORT || 8080;

app.enable('trust proxy');

app.get('/', authenticate, params, (req, res) => {
    const url = req.params.url;

    // No need to check for URL here; handled in params.js
    // Fetch the image from the URL
    request.get({ url, encoding: null }, (err, response, buffer) => {
        if (err || response.statusCode >= 400) {
            return res.status(500).send('Error fetching the image.');
        }

        req.params.originType = response.headers['content-type'] || '';
        req.params.originSize = buffer.length;

        if (shouldCompress(req)) {
            compress(req, res, buffer);
        } else {
            res.setHeader('content-type', req.params.originType);
            res.setHeader('content-length', buffer.length);
            res.status(200).send(buffer);
        }
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
