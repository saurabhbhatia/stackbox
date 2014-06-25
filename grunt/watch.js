// https://www.npmjs.org/package/grunt-contrib-watch

module.exports = {
    options: {
        spawn: false
    },
    scripts: {
        files: ['jquery.stackbox.js'],
        tasks: ['uglify']
    },
    css: {
        files: ['jquery.stackbox.less'],
        tasks: ['less', 'autoprefixer']
    },
}
