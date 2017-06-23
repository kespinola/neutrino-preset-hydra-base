const { mergeDeepLeft } = require('ramda');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = ({ config }) => {
  config.output.filename('[name].bundle.js')

  config.plugins.delete('chunk').end()

  config.plugins.delete('html').end()

  config.module
    .rule('compile')
    .use('babel')
    .tap(mergeDeepLeft({ presets: ['babel-preset-react', 'babel-preset-stage-0'] }))

  config.module.rules.delete('style')

  const splitCss = config.module
    .rule('style')
    .test(/\.s?[ca]ss$/)

  const extract = ExtractTextPlugin.extract({ use: ['css-loader?modules&localIdentName=[local]__[path][name]__[hash:base64:5]&importLoaders=1', 'sass-loader'], fallback: 'style-loader', publicPath: '/build' })

  extract.forEach(({ loader, options }) => splitCss.use(loader).loader(loader).options(options))

config
  .plugin('style')
  .use(ExtractTextPlugin, [{
    filename: '[name].bundle.css',
    allChunks: true
  }])
}
