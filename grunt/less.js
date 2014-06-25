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
            'dist/jquery.stackbox.min.css': 'src/jquery.stackbox.less'
        }
    }
}
