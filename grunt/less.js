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
            sourceMapFilename: 'dist/jquery.stackbox.min.css.map'
        },
        files: {
            'dist/jquery.stackbox.min.css': 'src/jquery.stackbox.less'
        }
    }
}
