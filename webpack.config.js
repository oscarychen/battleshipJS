const path = require('path');

require("babel-register");
const config = {
  entry: [
  './src/index.js',
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/build/',
    path: path.resolve(__dirname, './build'),
  }, 
  module: {
    rules : [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
          use: ['style-loader', 'css-loader'],
      }
      ]
    },
  plugins: [
  
  ],
  devServer: {
    contentBase: './',
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }

};

module.exports = config;
