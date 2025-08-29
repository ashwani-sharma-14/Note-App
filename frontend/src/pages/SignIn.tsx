"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import signupImage from "@/assets/signupImage.jpg";
import googleIcon from "@/assets/google.png";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader } from "lucide-react";
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().optional(),
  keepLoggedIn: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      otp: "",
      keepLoggedIn: false,
    },
  });
  async function onSubmit(values: SignInFormValues) {
    setOtpSent(true);
    try {
      if (!otpSent) {
        setIsLoading(true);
        await api.post("/auth/loginOtp", {
          email: values.email,
        });
        toast.success("OTP sent successfully");
        setOtpSent(true);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        const res = await api.post("/auth/login", {
          email: values.email,
          otp: values.otp,
        });
        if (!res.data.success) {
          setIsLoading(false);
          return toast.error(res.data.message);
        }

        setAuth({ isLoggedIn: true, user: res.data.user });
        navigate("/");
        setIsLoading(false);
        return toast.success(res.data.message);
      }
    } catch {
      toast.error("Internal Server Error");
    }
  }

  const googlelogin = async (code: string) => {
    try {
      const result = await api.get("/auth/googleLogin?code=" + code);
      if (result.data.success) {
        setAuth({ isLoggedIn: true, user: result.data.user });
        navigate("/");
        return toast.success(result.data.message);
      }
      return toast.error(result.data.message);
    } catch {
      toast.error("Internal Server Error");
    }
  };

  const handleSuccess = async (authResult: { code: string }) => {
    await googlelogin(authResult.code);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: () => toast.error("Google Login Error"),
    flow: "auth-code",
  });

  return (
    <div className="min-h-[92vh] bg-gray-50 flex md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row h-auto md:h-[560px]">
        <div className="p-8 md:w-[400px]">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600"></div>
              <h1 className="text-xl font-semibold">HD</h1>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Sign In</h1>
              <p className="mt-3 text-sm text-gray-500">
                Please login to continue to your account
              </p>
            </div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-black">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="border border-gray-400 focus-visible:ring-blue-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-black">
                      OTP
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter OTP"
                        className="border border-gray-400 focus-visible:ring-blue-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                onClick={async () => {
                  setOtpSent(false);
                  await api.post("/auth/loginOtp", {
                    email: form.getValues("email"),
                  });
                  toast.success("OTP sent successfully");
                  setOtpSent(true);
                }}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Resend OTP
              </div>

              <FormField
                control={form.control}
                name="keepLoggedIn"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-600">
                      Keep me logged in
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
                disabled={isLoading}
              >
                {otpSent ? isLoading ? <Loader /> : "Sign In" : "Get OTP"}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Need an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Create one
                </a>
              </p>
            </form>
          </Form>
          <div className="mt-2 text-center text-gray-600">
            <p>Or</p>
          </div>
          <div>
            <Button
              onClick={googleLogin}
              className="w-full bg-white text-black border border-gray-400 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              Sign up using Google
            </Button>
          </div>
        </div>
        <div className="hidden md:flex w-full h-64 md:h-full md:flex-1">
          <img
            src={signupImage}
            alt="SignIn"
            className="h-full w-full object-cover rounded-2xl md:rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
