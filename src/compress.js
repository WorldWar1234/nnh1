const sharp = require('sharp');

function compress(req, res) {
  const format = req.params.webp ? 'webp' : 'jpeg';

  sharp(req.params.buffer)
    .grayscale(req.params.grayscale)
    .toFormat(format, {
      quality: req.params.quality,
      progressive: true,
      optimizeScans: true
    })
    .toBuffer((err, output, info) => {
      if (err || !info || res.headersSent) {
        // If there's an error or the image cannot be compressed, send the original image
        res.setHeader('content-type', req.params.originType);
        res.setHeader('content-length', req.params.originSize);
        res.status(200).send(req.params.buffer);
      } else {
        res.setHeader('content-type', `image/${format}`);
        res.setHeader('content-length', info.size);
        res.setHeader('x-original-size', req.params.originSize);
        res.setHeader('x-bytes-saved', req.params.originSize - info.size);
        res.status(200).send(output);
      }
    });
}

module.exports = compress;
