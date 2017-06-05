const { mergeDeepLeft } = require('ramda');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = ({ config }) => {
  config
    .when(process.env.NODE_ENV === 'production', config => {
      config.output.filename('[name].bundle.js')
    });

  config.plugins.delete('html').end();

  config.module
    .rule('compile')
    .use('babel')
    .tap(mergeDeepLeft({ presets: ['babel-preset-react', 'babel-preset-stage-0'] }));

  config.module.rules.delete('style');

  const splitCss = config.module
    .rule('style')
    .test(/\.css$/);

  const extract = ExtractTextPlugin.extract({ use: 'css-loader?modules&localIdentName=[local]__[path][name]__[hash:base64:5]&importLoaders=1', fallback: 'postcss-loader', publicPath: '/build' });

  extract.forEach(({ loader, options }) => splitCss.use(loader).loader(loader).options(options));

config
  .plugin('style')
  .use(ExtractTextPlugin, [{
    filename: '[name].bundle.css',
    allChunks: true
  }]);
}
