const sharp = require('sharp');

function compress(req, res, input) {
    const format = req.params.webp ? 'webp' : 'jpeg';

    sharp(input)
        .grayscale(req.params.grayscale)
        .toFormat(format, {
            quality: req.params.quality,
            progressive: true,
            optimizeScans: true
        })
        .toBuffer((err, output, info) => {
            if (err || !info || res.headersSent) {
                return redirect(req, res);
            }

            res.setHeader('content-type', `image/${format}`);
            res.setHeader('content-length', info.size);
            res.setHeader('x-original-size', req.params.originSize);
            res.setHeader('x-bytes-saved', req.params.originSize - info.size);
            res.setHeader('content-encoding', 'identity');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
            res.status(200).send(output);
        });
}

module.exports = compress;
