const path = require("path")

module.exports = {
    entry: {
        index: ["@babel/polyfill", "./src/index.tsx"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        port: 3000
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]

    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            },
            {
                test: /\.(svg|otf)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "assets"
                    }
                }]
            }
        ]
    }
}