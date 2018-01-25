const path = require('path');

const p = (...parts) => path.resolve(__dirname, ...parts);

module.exports = {
  entry: ['@babel/polyfill', p('demo', 'src', 'index.js')],
  output: {
    filename: 'bundle.js',
    path: p('demo', 'dist')
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.mo$/,
        use: ['babel-loader', p('dist', 'loader.js')]
      }
    ]
  },
  resolve: {
    alias: {
      'gettextjs': p('src', 'runtime.js')
    }
  }
};
