const path = require('path');

module.exports = {
    entry: {
      main: './client/client.js',
      overviewPage: ['./client/overviewPage/overview.jsx', './client/overviewPage/raceTable.jsx'],
      racePage: ['./client/racePage/raceTable.jsx'],
      driverPage: ['./client/driverPage/infoTable.jsx', './client/driverPage/pointsGraph.jsx', './client/driverPage/pointsChangeGraph.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};