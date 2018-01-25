const path = require('path');

const p = (...parts) => path.resolve(__dirname, ...parts);

const demo = {
  entry: ['@babel/polyfill', p('demo', 'src', 'index.js')],
  output: {
    filename: 'bundle.js',
    path: p('demo', 'dist')
  },
  target: 'web',
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
};

module.exports = {
  entry: ['@babel/polyfill', p('src', 'loader.js')],
  output: {
    filename: 'loader.js',
    path: p('dist'),
    libraryTarget: 'commonjs2',
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
