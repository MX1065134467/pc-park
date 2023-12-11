const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  publicPath: './',
  outputDir: process.env.outputDir,
  assetsDir: 'static',
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,
  chainWebpack: config => {
    // 移除 prefetch 插件 关闭预加载模块
    config.plugins.delete('prefetch')

    config.resolve.alias
      .set('@', resolve('src'))
      .set('@c', resolve('src/components'))
      .set('@v', resolve('src/views'))

    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }

    // 对vue-cli内部的 webpack 配置进行更细粒度的修改
    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.mode = 'production'
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10K的数据进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })]
      }
    }
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 8004,
    https: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/': {
        // target: 'http://192.168.100.85:8850', // 朱严
        // target: 'http://192.168.100.81:8850/', // 赵勋
        // target: 'http://192.168.100.187:8080', // 熊熊
        // target: 'http://172.16.86.22:8074', // 测试环境
        target: 'http://172.16.152.22:8074',
        // target: 'http://192.168.100.188:8850', // 王思远
        ws: true,
        changeOrigin: true // 设置同源  默认false，是否需要改变原始主机头为目标URL
      },
      '^/VMS2Service.cgi': {
        target: 'http://172.16.40.210',
        changeOrigin: true
      },
      '^/command': {
        target: 'http://172.16.40.213:8000/',
        changeOrigin: true
      }
    }
  }
}
