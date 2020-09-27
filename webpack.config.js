// добавляем стандартный модуль для работы с путями
const path = require('path') // получаем из списка станрдартных пакетов из nodejs
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]

  if (isDev) {
    // добавим еще один лоадер  и вернем массив лоадеров в функции
    loaders.push('eslint-loader')
  }
  return loaders
}

console.log('IS PROD = ', isProd)
console.log('IS DEV = ', isDev)

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

module.exports = {
  // добавляем конфигурацию
  // где лежат исходники
  context: path.resolve(__dirname, 'src'), //  __dirname  - переменная с абсолютным путем для исходной папки
  mode: 'development', // указываем в явном виде режим разработки
  entry: ['@babel/polyfill', './index.js'], // точка входа
  output: {
    filename: filename('js'), // возможно у bundle  будет несколько версий
    path: path.resolve(__dirname, 'dist'),

  },
  resolve: {
    extensions: ['.js'], // по умолчанию грузим файлы с расш. js
    // import '../../../core/Component
    // import '@core/Component' для этого зададим алиасы для путе
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },

  },
  devtool: isDev ? 'source-map': false,
  devServer: {
    port: 3000,
    hot: isDev,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd, // удаляем если режим продакт
        collapseWhitespace: isProd, // удаляем если режим продакт
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'), // в какой файл надо поместить сгенерированный  CSS
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(), // возвращаем лоадеры через функцию jsLoaders()

        // тут были лоадеры
        /*
                 loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
                 */
      },
    ],
  },


}
