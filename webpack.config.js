var path = require ('path')
var utils = require ('./utils')
var webpack = require ('webpack')
var es3ifyPlugin = require('es3ify-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve (dir) {
    return path.join (__dirname, '..', dir)
}
var curSubPath = "dist/static"

module.exports = {
    entry: {
      app: './src/app.js'
    },
    output: {
        path: path.resolve (__dirname, '../dist'),
        filename: '[name].js',
        publicPath: "/"
    },
    resolve: {
        extensions: ['', '.js', '.kov', '.json', '.css', ".vue", "swf"], // 1.x 版本 ''是必须的,  2.x 版本不能写
        alias: {
            jquery: path.resolve(__dirname, './src/libs/jquery-1.9.1.js'),
            knockout: path.resolve(__dirname, './src/libs/knockout-3.5.0beta.js'),
            //state: path.resolve (__dirname, '../src/libs/state.js'),
            pageInit: path.resolve (__dirname, './src/libs/page.js'),
        },
        root: path.join (__dirname, 'src')
    },
    module: {

        // preLoaders: [
        //   {
        //     test: /\.(kov|js)$/,
        //     loader: 'eslint-loader',
        //     exclude: [/node_modules/, path.join (__dirname, '../src/lib'), path.join (__dirname, '../src/utils/validation.js'), path.join (__dirname, '../src/utils/logger.js'), path.join (__dirname, '../src/utils/storage.js')],
        //     include: [resolve('src'), resolve('test')]
        //   }
        // ],
        loaders: [
            {
                test: /\.kov$/,
                loader: 'kov-loader?inject=true',
                // options: {
                //     extractCSS: true
                // }
                //options: vueLoaderConfig
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract ('style-loader!css-loader')
            }
            , {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract ('style-loader!css-loader!less-loader')
            }
            , {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: [path.join (__dirname, '../src'),path.join (__dirname, '../test/unit')],
                exclude: [path.join (__dirname, '../src/libs')]  //lib 下的库不需要被转换
            }
            , {
                test: /\.styl$/,
                loaders: ['style-loader', 'css-loader', 'stylus-loader']
            },
            {
                test: /\.(png|jpg|gif|svg|pdf)$/,
                loader: 'url-loader?limit=1&name='+curSubPath+'/images/[name].[hash:7].[ext]'
            },
            {
                test: /\.(htc)$/,
                loader: 'url-loader?limit=1'
            },
            { test: /\.swf$/, loader: "file?name="+curSubPath+"/swf/[name].[hash:7].[ext]" },
            { test: /\.json$/, loader: "file?name="+curSubPath+"/json/[name].[hash:7].[ext]" }
        ]
    }
    ,
    vue: {
        loaders: utils.cssLoaders({
            sourceMap: true,
            extract: true
        }),
        transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
        },
        autoprefixer: {
            browsers: ["> 1%", "last 7 versions"],
            cascade: false  // 不美化输出 css
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin ({
            name: 'manifest',
            chunks: ['vendor']
        }),

        new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css'), {allChunks: true}),
        // new ExtractTextPlugin({
        //     filename: utils.assetsPath('css/[name].[contenthash].css'), allChunks:true
        // }),
        new es3ifyPlugin(),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin()
        ,
        //new webpack.NoEmitOnErrorsPlugin(),  // webpack1 not support
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'index.html'),
            inject: false
        })
    ]
}
