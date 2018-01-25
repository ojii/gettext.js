const path = require('path');

const p = (...parts) => path.resolve(__dirname, ...parts);

module.exports = {
  entry: [p('src', 'runtime.js')],
  output: {
    filename: 'runtime.js',
    path: p('dist'),
    library: 'gettextjs',
    libraryTarget: 'commonjs2'
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
      }
    ]
  }
};
