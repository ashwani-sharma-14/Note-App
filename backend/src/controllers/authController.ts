import { User } from "@/model/user";
import type { Response, Request } from "express";
import { sendSignupCode } from "@/lib/emailService";
import { Otp } from "@/model/otp";
import { generateTokens } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";
import { oauth2Client } from "@/config/google.config";
import axios from "axios";
export const signUpOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    sendSignupCode(email, otp);
    await Otp.create({
      email: email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    return res
      .json({ message: "You signup OTP is sent to your email" })
      .status(200);
  } catch (error) {
    return res.status(500).json({ message: "server error" }).status(500);
  }
};

export const loginOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    sendSignupCode(email, otp);
    await Otp.create({
      email: email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    return res
      .json({ message: "You login OTP is sent to your email" })
      .status(200);
  } catch (error) {
    return res.status(500).json({ message: "server error" }).status(500);
  }
};

export const signUP = async (req: Request, res: Response) => {
  try {
    const { name, email, dob, otp } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const otpRecord = await Otp.findOne({ email, code: otp });

    if (!otpRecord) {
      return res.status(200).json({ success: false, message: "Invalid OTP" });
    }
    if (otpRecord.expiresAt && otpRecord.expiresAt.getTime() < Date.now()) {
      return res.status(200).json({ success: false, message: "OTP expired" });
    }
    const user = await User.create({ name, email, dob });
    const { accessToken } = generateTokens({
      userId: user._id as string,
      email: user.email,
    });
    await Otp.deleteOne({ email });
    return setAuthCookie(res, accessToken, "User created", user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" }).status(500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not exists please signUP" });
    const otpRecord = await Otp.findOne({ email, code: otp });
    if (!otpRecord)
      return res.status(200).json({ success: false, message: "Invalid OTP" });
    if (otpRecord.expiresAt.getTime() < Date.now())
      return res.status(200).json({ success: false, message: "OTP expired" });
    const { accessToken } = generateTokens({
      userId: user._id as string,
      email: user.email,
    });
    await Otp.deleteOne({ email });
    return setAuthCookie(res, accessToken, "User Logged In successfully", user);
  } catch (error) {
    return res.status(500).json({ message: "server error" }).status(500);
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(401).json({ message: "code not found" });
    }

    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    if (!userRes || !userRes.data) {
      return res
        .status(401)
        .json({ success: false, message: "user not found" });
    }

    let user = await User.findOne({ email: userRes.data.email });

    if (user) {
      if (user.provider != "google") {
        return res.status(200).json({
          success: false,
          message:
            "You haven’t signed up using Google. Please use your original login method.",
        });
      }
    } else {
      user = await User.create({
        name: userRes.data.name,
        email: userRes.data.email,
        provider: "google",
      });
    }

    const { accessToken } = generateTokens({
      userId: user._id as string,
      email: user.email,
    });

    return setAuthCookie(res, accessToken, "User logged in successfully", user);
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    return setAuthCookie(res, "", "User Logged Out");
  } catch (error) {
    return res.status(500).json({ message: "server error" }).status(500);
  }
};
