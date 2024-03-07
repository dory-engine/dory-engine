const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://vm.dory.cookeem.com:30001',
        changeOrigin: true,
        ws: true
      }
    }
  },
  lintOnSave: false,

  transpileDependencies: [
    'vuetify',
    'vue-echarts',
    'resize-detector'
  ],

  productionSourceMap: false,

  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['json'], // 配置需要的languages，减少打包后的体积
        output: './static/js/monaco-editor'
      })
    ]
  },
  chainWebpack: config => {
    config.plugins.delete('VuetifyLoaderPlugin')
  }
}
