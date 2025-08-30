import { Router } from "express";
import {
  googleLogin,
  login,
  loginOtp,
  logout,
  signUP,
  signUpOtp,
} from "@/controllers/authController.js";

const AuthRouter = Router();

AuthRouter.post("/signUpOtp", signUpOtp);
AuthRouter.post("/loginOtp", loginOtp);
AuthRouter.post("/signUp", signUP);
AuthRouter.post("/login", login);
AuthRouter.get("/googleLogin", googleLogin);
AuthRouter.get("/logout", logout);
export default AuthRouter;
