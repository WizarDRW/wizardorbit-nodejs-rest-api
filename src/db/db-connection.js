const connectionString = process.env.DB_HOST
var mongoose = require("mongoose");
const { serverLogger } = require('../utils/logger.utils');

module.exports = () => {
    mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true });

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
        serverLogger.info('MongoDB: Connected')
      });
      mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
        serverLogger.error(`MongoDB: Error: ${err.message}`)
      });

    mongoose.Promise = global.Promise;
}
