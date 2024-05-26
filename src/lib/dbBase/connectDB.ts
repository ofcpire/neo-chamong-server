import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
const isDBSecured = process.env.IS_DB_SECURED;
const dbId = process.env.DB_ID;
const dbPw = process.env.DB_PW;
const dbAddress = process.env.DB_ADDRESS;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const logger = new Logger('connectDB');

// MONGOOSE CONNECT
const connectDB = async () => {
  const dbConnectString =
    isDBSecured === 'true'
      ? `mongodb://${dbId}:${dbPw}@${dbAddress}:${dbPort}/${dbName}`
      : `mongodb://${dbAddress}:${dbPort}/${dbName}`;
  logger.log(`Connect to ${dbConnectString}`);
  mongoose
    .connect(dbConnectString)
    .then(() => {
      logger.log(`Connected to MongoDB => ${dbName}`);
    })
    .catch((err) => {
      logger.log(err);
    });
};

export default connectDB;
