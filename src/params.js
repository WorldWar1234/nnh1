const DEFAULT_QUALITY = 40;

function params(req, res, next) {
    const { url, jpeg, bw, l } = req.query;

    // Check if URL parameter is missing
    if (!url) {
        return res.end('bandwidth-hero-proxy');
    }

    // Process parameters if URL is present
    const urls = Array.isArray(url) ? url.join('&url=') : url;
    const cleanedUrl = urls.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');

    req.params.url = cleanedUrl;
    req.params.webp = !jpeg;
    req.params.grayscale = bw !== '0';
    req.params.quality = parseInt(l, 10) || DEFAULT_QUALITY;

    next();
}

module.exports = params;
