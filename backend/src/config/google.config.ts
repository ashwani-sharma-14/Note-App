import { google } from "googleapis/build/src";
import { envConfig } from "./env.config";

const clinetId = envConfig.authClientId as string;
const clientSecret = envConfig.authClientSecret as string

export const oauth2Client = new google.auth.OAuth2(
  clinetId,
  clientSecret,
  "postmessage"
);