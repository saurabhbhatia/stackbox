// https://www.npmjs.org/package/grunt-contrib-qunit

module.exports = {
    options: {
        timeout: 15000,
        urls: [
            'http://127.0.0.1:8000/test/index.html',
        ]
    },
    all: ['http://127.0.0.1:8000/test/index.html']
};
