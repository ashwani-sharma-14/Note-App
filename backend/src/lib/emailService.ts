import { transporter } from "@/config/nodemailer.config.js";
import { envConfig } from "@/config/env.config.js";
export const loginOtp = async (email: string, name: string, code: number) => {
  const emailInfo = await transporter.sendMail({
    from: `${envConfig.from}<${envConfig.mailerEmail}>`,
    to: email,
    subject: "Login to Note App",
    html: `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #004080;">Dear, ${name}!</h2>
    <p>
    This is your One Time Password to Login to the Note app the OTP id Valid for 5 minutes
    </p>
    <div style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 20px 0;">
      ${code}
    </div>

    <p style="margin-top: 30px;">
      Regards,<br/>
      <strong>Ashwani Sharma</strong><br/>
    </p>
  </div>
`,
  });
  return emailInfo.response;
};

export const sendSignupCode = async (email: string, code: number) => {
  const emailInfo = await transporter.sendMail({
    from: `${envConfig.from}<${envConfig.mailerEmail}>`,
    to: email,
    subject: "Welcome to Note App",
    html: `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">

    <p>Dear User,</p>

    <p>
    This is your One Time Password to signUp to the Note app the OTP id Valid for 5 minutes
    </p>
    <div style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 20px 0;">
      ${code}
    </div>

    <p style="margin-top: 30px;">
      Regards,<br/>
      <strong>Ashwani Sharma</strong><br/>

    </p>
  </div>
`,
  });
  return emailInfo.response;
};
