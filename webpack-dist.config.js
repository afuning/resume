const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const findChrome = require('chrome-finder')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const EndWebpackPlugin = require('end-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const outputPath = path.resolve(__dirname, './public')
const outputStaticPath = path.resolve(__dirname, './public/static')
module.exports = {
  mode: 'production',
  output: {
    path: outputPath,
    filename: '[name]_[chunkhash:8].js',
  },
  resolve: {
    // 加快搜索速度
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
    // es tree-shaking
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // 提取出css
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.css$/,
        // 提取出css
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        loader: 'base64-inline-loader',
      },
    ]
  },
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({
        uglifyJS: {
          output: {
            comments: false,//是否保留代码中的注释，默认为保留
          },
          warnings: true,//是否在UglifyJS删除没有用到的代码时输出警告信息，默认为false
          compress:{
            drop_console: true,//是否删除代码中所有的console语句，默认为false
            collapse_vars: true,//是否内嵌虽然已经定义了，但是只用到一次的变量， 默认值false
            reduce_vars: true,//是否提取出现了多次但是没有定义成变量去引用的静态值，默认为false
          }
        },
        cacheDir: '',//用作缓存的可选绝对路径。如果未提供，则不使用缓存。
        sourceMap: false,//可选布尔值。是否为压缩后的代码生成对应的Source Map(浏览器可以在调试代码时定位到源码位置了),这会减慢编译速度。默认为false
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: { safe: true }
      })
    ]
  },
  entry: {
    main: './src/main.js',
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
      ignoreOrder: true
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: path.resolve(__dirname, './public/static')
      }
    ]),
    new EndWebpackPlugin(async () => {
      // 调用 Chrome 渲染出 PDF 文件
      const chromePath = findChrome()
      const spawn = spawnSync(chromePath, ['--headless', '--disable-gpu', `--print-to-pdf=${path.resolve(outputStaticPath, 'resume.pdf')}`,
        'http://49.235.122.8:8080/' // 这里注意改成你的在线简历的网站
      ])
      fs.chmodSync(path.resolve(outputStaticPath, 'resume.pdf'), 0644)
    }),
  ]
}
