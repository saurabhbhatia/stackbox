// https://www.npmjs.org/package/grunt-contrib-copy

module.exports = {
    assets_css: {
        nonull: true,
        files: [{
            filter: 'isFile',
            expand: true,
            flatten: true,
            src: 'bower_components/font-awesome/fonts/*',
            dest: 'demo/fonts'
        }]
    }
}
