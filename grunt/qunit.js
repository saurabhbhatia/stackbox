// https://www.npmjs.org/package/grunt-contrib-qunit

module.exports = {
    options: {
        urls: [
            'http://localhost:3000/test/index.html',
        ]
    },
    all: ['test/index.html']
};
