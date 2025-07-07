const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        util: require.resolve('util/'),
        url: require.resolve('url/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        vm: require.resolve('vm-browserify'),
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        module: false,
    };

    config.resolve.extensions = [
        ...config.resolve.extensions,
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
        '.mjs'
    ];

    config.resolve.alias = {
        ...config.resolve.alias,
        'process/browser': require.resolve('process/browser'),
    };

    // Disable source map warnings for Cardano SDK
    config.module.rules.push({
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [
            /node_modules\/@cardano-sdk/,
        ],
    });

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ]);

    // Suppress source map warnings and React DOM warnings
    config.ignoreWarnings = [
        /Failed to parse source map/,
        /Invalid DOM property/,
        /Did you mean/
    ];

    return config;
}
