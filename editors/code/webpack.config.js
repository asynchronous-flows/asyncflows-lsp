
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

//@ts-check

'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

const nodeExternals = require('webpack-node-externals');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  node: {
    __dirname: true,
    __filename: true,
  },
  entry: {
    extension: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    languageserver: './node_modules/asyncflows-lsp/out/server/src/server.js',
  },
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  // @ts-ignore
  externals: [ {
    'vscode': 'commonjs vscode',
  }],
  // externals: {
  //   vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  //   prettier: 'commonjs prettier',
  // },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js', '.node', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /node_modules[\\|/](vscode-json-languageservice)/,
        use: { loader: 'umd-compat-loader' },
      },

      {
        test: /\.node$/,
        use: 'node-loader', // Loader for native bindings
      },
    ],
  },
};

module.exports = config;
