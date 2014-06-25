// https://www.npmjs.org/package/grunt-contrib-uglify

module.exports = {
    options: {
        banner: '/*! <%= package.description %> v<%= package.version %> <%= grunt.template.today("dd.mm.yyyy") %> */\n',
        sourceMap: true
    },
    dist: {
        files: {
            'dist/jquery.stackbox.min.js': [
                'src/jquery.stackbox.js'
            ]
        }
    }
}
