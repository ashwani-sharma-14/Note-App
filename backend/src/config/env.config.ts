import { configDotenv } from "dotenv";
configDotenv();

export const envConfig = {
  dbUrl: process.env.DB_URL,
  authClientId: process.env.OAUTH_CLIENT_ID,
  authClientSecret: process.env.OAUTH_CLIENT_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtTimeOut: process.env.JWT_TIMEOUT,
  port: process.env.PORT,
  password: process.env.PASSWORD,
  mailerEmail: process.env.MAILER_EMAIL,
  mailerPassword: process.env.MAILER_PASSWORD,
  mailerService: process.env.MAILER_SERVICE,
  from: process.env.FROM,
  nodeEnv: process.env.NODE_ENV,
};
