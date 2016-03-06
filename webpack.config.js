var path = require('path');
var webpack = require('webpack');

var outputDirectory = path.resolve(__dirname, "server/static");

//https://github.com/shakacode/bootstrap-loader/tree/master/examples/basic

module.exports = {
    entry: ['./client/src/index.js'],
    output: {
        path: outputDirectory,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js|jsx$/, //path.join(__dirname, 'lib/www/client'),
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "client/src")
                ],
            },
            //{test: /\.css$/, loader: 'style-loader!css-loader'},
            { test: /\.css$/, loaders: [ 'style', 'css', /*'postcss'*/ ] },
            { test: /\.scss$/, loaders: [ 'style', 'css', /*'postcss'*/, 'sass' ] },
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
            {test: /\.gif/, loader: "url-loader?limit=10000&mimetype=image/gif"},
            {test: /\.jpg/, loader: "url-loader?limit=10000&mimetype=image/jpg"},
            {test: /\.png/, loader: "url-loader?limit=10000&mimetype=image/png"}
        ]
    },
    externals: {
    },
    "resolveLoader": {
        "root": "/Users/g/XenBots/senzflow-gateway/node_modules",
        "alias": {}
    },
    resolve: {
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            _: "lodash-compat"
        })
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map'
};