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
import signupImage from "../assets/signupImage.jpg";
import googleIcon from "@/assets/google.png";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
// Step schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().nonempty("Date of birth is required"),
  email: z.string().email("Invalid email address"),
  otp: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      dob: "",
      email: "",
      otp: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setOtpSent(true);
    try {
      if (!otpSent) {
        setIsLoading(true);
        await api.post("/auth/signUpOtp", {
          email: values.email,
        });
        setOtpSent(true);
        toast.success("OTP sent successfully");
        setIsLoading(false);
      } else {
        setIsLoading(true);
        const res = await api.post("/auth/signUp", {
          name: values.name,
          dob: values.dob,
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
    onError: () => toast.error("Google Login Error:"),
    flow: "auth-code",
  });

  return (
    <div className="min-h-[92vh] bg-gray-50 flex md:items-center justify-center p-4">
      <div
        className={cn(
          "bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row",
          otpSent ? "h-auto md:h-auto min-h-[560px]" : "h-auto md:min-h-[560px]"
        )}
      >
        <div className="p-8 md:w-[400px]">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold"></div>
              <h1 className="text-xl font-semibold">HD</h1>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Sign Up</h1>
              <p className="mt-3 text-sm text-gray-500">
                Sign up to enjoy the features of HD
              </p>
            </div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-black">
                      Your Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jonas Kahnwald"
                        className="border border-gray-400 focus-visible:ring-blue-300"
                        {...field}
                        disabled={otpSent}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-black">
                      Date of birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="border border-gray-400 focus-visible:ring-blue-300"
                        {...field}
                        disabled={otpSent}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
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
                        placeholder="jonas.kahnwald@gmail.com"
                        className="border border-gray-400 focus-visible:ring-blue-300"
                        {...field}
                        disabled={otpSent}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OTP field only when sent */}
              {otpSent && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-black">
                        Enter OTP
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter 6-digit OTP"
                          className="border border-gray-400 focus-visible:ring-blue-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
              >
                {otpSent ? isLoading ? <Loader /> : "Sign Up" : "Get OTP"}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-2">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in
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

        {/* Right Side (Image) */}
        <div className="hidden md:flex md:flex-1">
          <img
            src={signupImage}
            alt="Signup"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
