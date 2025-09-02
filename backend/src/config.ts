import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/focusflow',
  sessionSecret: process.env.SESSION_SECRET || 'devsecret',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  cookieName: 'ff.sid',
};


