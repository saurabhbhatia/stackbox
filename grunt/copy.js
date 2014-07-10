// https://www.npmjs.org/package/grunt-contrib-copy

module.exports = {
    dist: {
        options: {
            nonull: true
        },
        files: [{
            src: 'bower_components/animate.css/animate.css',
            dest: 'test/animate.css'
        }, {
            src: 'bower_components/animate.css/animate.js',
            dest: 'test/animate.js'
        }]
    }
};
