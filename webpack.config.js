// Webpack uses this to work with directories
const path = require('path');
const DirectoryNamedPlugin = require('directory-named-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TerserPlugin = require('terser-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isDevelopment = true;

const stylesEntryFiles = {
  styles: './styles/styles.scss',
};

// a list of the entry files used to generate scripts bundles.
const scriptsEntryFiles = {
  main: './js/ui/main.js',
};

const entryFiles = { ...stylesEntryFiles, ...scriptsEntryFiles };

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {
  // only turn on watchers when on development mode, this in order to allow builds to finish on Jenkins
  watch: !!isDevelopment,
  // this change makes builds on local machines faster, and source-maps better for local development.
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  mode: 'production',
  context: path.resolve(__dirname, './'),
  entry: entryFiles,
  output: {
    filename: 'modules/[name].js',
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // this is to delete de XXXX.Licence files that webpack generates automatically for each bundle.
  optimization: {
    nodeEnv: 'production',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            ecma: 2022,
            module: true,
          },
        },
        extractComments: 'all',
      }),
    ],
    usedExports: true,
  },
  plugins: [
    // used to remove old versions of the files both before the main compilation
    // and during webpack watch
    new RemovePlugin({
      before: {
        include: ['./dist/modules', './dist/styles'],
      },
      watch: {
        include: ['./dist/modules', './dist/styles'],
      },
    }),
    // lint files.
    new ESLintPlugin({
      overrideConfigFile: './.eslintrc.js',
      fix: true,
    }),

    // generate the rev-manifest file
    new WebpackAssetsManifest({
      merge: true,
      output: path.resolve(__dirname, './rev-manifest.json'),
      writeToDisk: true,
      customize(entry) {
        // prevent .map files from being added to the manifest.
        if (entry.key.toLowerCase().endsWith('.map')) {
          return false;
        }
        return {
          key: `modules/${entry.key}`.toLowerCase(),
          value: entry.value,
        };
      },
    }),

    // bundle SASS and CSS files.
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['./'] },
    }),
  ],
  resolve: {
    /**
     * Extensions to resolve
     */
    extensions: ['.js'],
    /**
     * Register Aliases (used to predict common directories)
     */
    // alias: {
    //   dataTransferObjects: path.resolve(__dirname, '../GlobalResources23/scripts/dataTransferObjects'),
    //   utils: path.resolve(__dirname, '../GlobalResources23/scripts/utils'),
    //   api: path.resolve(__dirname, '../GlobalResources23/scripts/apis'),
    //   '@components': path.resolve(__dirname, '../GlobalResources23/scripts/components'),
    //   constants: path.resolve(__dirname, '../GlobalResources23/scripts/constants'),
    //   features: path.resolve(__dirname, '../GlobalResources23/scripts/features'),
    //   layout: path.resolve(__dirname, '../GlobalResources23/scripts/layout'),
    //   libraries: path.resolve(__dirname, '../GlobalResources23/scripts/libraries/'),
    //   models: path.resolve(__dirname, '../GlobalResources23/scripts/models/'),
    //   modules: path.resolve(__dirname, '../GlobalResources23/scripts/modules/'),
    //   pages: path.resolve(__dirname, '../GlobalResources23/scripts/pages/'),
    //   '@redux': path.resolve(__dirname, '../GlobalResources23/scripts/redux/'),
    //   searchResults: path.resolve(__dirname, '../GlobalResources23/scripts/page/searchResults'),
    //   services: path.resolve(__dirname, '../GlobalResources23/scripts/services/'),
    // },
    plugins: [new DirectoryNamedPlugin({ exclude: /node_modules/ })],
  },
};
