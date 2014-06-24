// https://www.npmjs.org/package/grunt-contrib-less
// http://lesscss.org/usage/#command-line-usage

module.exports = {
    options: {
        compress: true,
        yuicompress: true,
        optimization: 2,
        sourceMap: true
    },
    dist: {
        options: {
            sourceMapFilename: 'jquery.stackbox.min.map'
        },
        files: {
            'jquery.stackbox.min.css': 'jquery.stackbox.less'
        }
    }
}
