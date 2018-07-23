

var express = require ('express')
var webpack = require ('webpack')

var webpackConfig = require("./webpack.config")

var app = express ()
var compiler = webpack (webpackConfig)

var devMiddleware = require ('webpack-dev-middleware') (compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

app.use (devMiddleware)




var server = app.listen ("9009");