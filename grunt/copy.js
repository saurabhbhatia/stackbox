// https://www.npmjs.org/package/grunt-contrib-copy

module.exports = {
    dist: {
        options: {
            nonull: true
        },
        files: [{
            filter: 'isFile',
            expand: true,
            flatten: true,
            src: 'bower_components/font-awesome/fonts/*',
            dest: 'demo/fonts/'
        }, {
            src: 'bower_components/font-awesome/css/font-awesome.css',
            dest: 'demo/css/font-awesome.css'
        }]
    }
};
