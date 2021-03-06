var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var merge = require('merge')



exports.assetsPath = function (_path) {
    var assetsSubDirectory = "dist/static"
    return path.posix.join(assetsSubDirectory, _path)
}


exports.cssLoaders = options => {
    options = options || {}
    // generate loader string to be used with extract text plugin
    const generateLoaders = loaders => {
        const sourceLoader = loaders.map(loader => {
                let extraParamChar
                if (/\?/.test(loader)) {
            //loader = loader.replace(/\?/, '-loader?')
            extraParamChar = '&'
        } else {
            //loader = loader + '-loader'
            extraParamChar = '?'
        }
        return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract(sourceLoader)
        } else {
            return ['vue-style-loader', sourceLoader].join('!')
        }
    }

    // http://vuejs.github.io/vue-loader/configurations/extract-css.html
    return {
        css: generateLoaders(['css?-autoprefixer']),
        postcss: generateLoaders(['css']),
        less: generateLoaders(['css?-autoprefixer', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders(['css', 'stylus']),
        styl: generateLoaders(['css', 'stylus'])
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

