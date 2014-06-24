// https://www.npmjs.org/package/grunt-autoprefixer

module.exports = {
    dist: {
        options: {
            browsers: ['last 2 versions', 'ie 9'],
            map: true
        },
        files: {
            'jquery.stackbox.min.css': ['jquery.stackbox.min.css']
        }
    }
}
