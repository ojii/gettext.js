const path = require('path');

const p = (...parts) => path.resolve(__dirname, ...parts);

module.exports = {
  entry: ['@babel/polyfill', p('src', 'bin.js')],
  output: {
    filename: 'bin.js',
    path: p('dist'),
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
