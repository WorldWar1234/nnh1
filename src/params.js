const DEFAULT_QUALITY = 40;
const request = require('request');
const pick = require('lodash').pick;

function params(req, res, next) {
  const { url, jpeg, bw, l } = req.query;

  if (!url) {
    return res.end('bandwidth-hero-proxy');
  }

  const urls = Array.isArray(url) ? url.join('&url=') : url;
  const cleanedUrl = urls.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');

  req.params.url = cleanedUrl;
  req.params.webp = !jpeg;
  req.params.grayscale = bw !== '0';
  req.params.quality = parseInt(l, 10) || DEFAULT_QUALITY;

  // Fetch the image and store the buffer in the request parameters
  request.get(
    req.params.url,
    {
      headers: {
        ...pick(req.headers, ['cookie', 'dnt', 'referer']),
        'user-agent': 'Bandwidth-Hero Compressor',
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
        via: '1.1 bandwidth-hero'
      },
      timeout: 10000,
      maxRedirects: 5,
      encoding: null,
      strictSSL: false,
      gzip: true,
      jar: true
    },
    (err, origin, buffer) => {
      if (err || origin.statusCode >= 400) {
        return res.status(origin.statusCode).end();
      }

      req.params.originType = origin.headers['content-type'] || '';
      req.params.originSize = buffer.length;
      req.params.buffer = buffer;

      next();
    }
  );
}

module.exports = params;
