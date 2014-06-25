// https://www.npmjs.org/package/grunt-contrib-watch

module.exports = {
    options: {
        spawn: false
    },
    scripts: {
        files: ['plugin/src/jquery.stackbox.js'],
        tasks: ['uglify']
    },
    css: {
        files: ['plugin/src/jquery.stackbox.less'],
        tasks: ['less', 'autoprefixer']
    },
}
