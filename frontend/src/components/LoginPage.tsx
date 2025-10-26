import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { OTPVerificationModal } from "./OTPVerificationModal";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Send,
  AlertCircle,
  GraduationCap,
  Users,
  Award,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { passwordLogin, sendLoginOtp } from "../../Services/LoginServices";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export function LoginPage({
  onLoginSuccess,
  onSwitchToSignup,
  onSwitchToForgotPassword,
}: LoginPageProps) {
  // Password Login State
  const [passwordForm, setPasswordForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // OTP Login State
  const [otpForm, setOtpForm] = useState({
    email: "",
  });
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const validateEmail = (email: string): string => {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Invalid email address"
      : "";
  };

  const validatePassword = (password: string): string => {
    return password.length < 8 ? "Password must be at least 8 characters" : "";
  };

  // Password Login Handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    const emailError = validateEmail(passwordForm.email);
    const passwordError = validatePassword(passwordForm.password);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error("Please fix all errors");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await passwordLogin(
        passwordForm.email,
        passwordForm.password
      );

      // Example expected structure: { success: true, token: "..." }
      if (response?.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", response.token);
        onLoginSuccess();
      } else {
        toast.error(response?.message || "Invalid credentials");
      }
    } catch (error: any) {
      // If backend returns error
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password";
      toast.error(message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // OTP Login Handlers
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpForm((prev) => ({ ...prev, [name]: value }));
    if (otpErrors[name]) {
      setOtpErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(otpForm.email);
    if (emailError) {
      setOtpErrors({ email: emailError });
      toast.error("Please enter a valid email");
      return;
    }

    setIsOtpLoading(true);
    try {
      const response: any = await sendLoginOtp(otpForm.email);
      console.log("response", response);

      if (response?.message === "Login OTP sent") {
        setShowOTPModal(true);
        toast.success(response?.message || "OTP sent to your email!");
      } else {
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while sending OTP";
      toast.error(message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowOTPModal(false);
    toast.success("Login successful!");
    onLoginSuccess();
  };

  const handleResendOTP = () => {
    // Simulate resending OTP
    console.log("Resending OTP...");
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTQgMTZ2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem0tMTYgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00LTEydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative z-10 max-w-lg space-y-8 animate-in fade-in slide-in-from-left duration-700">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight">CoachPro</h1>
              <p className="text-blue-100 text-sm">
                White-Label Coaching Platform
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl tracking-tight leading-tight">
              Build Your
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Dream Institute
              </span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create stunning, professional coaching websites in minutes. No
              coding required.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-4">
            {[
              {
                icon: Users,
                text: "Unlimited Students & Teachers",
                value: "10,000+",
              },
              { icon: Award, text: "Ready-Made Templates", value: "50+" },
              { icon: Sparkles, text: "Active Institutes", value: "500+" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 animate-in slide-in-from-left"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="p-2 bg-white/10 rounded-lg">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-100">{feature.text}</p>
                </div>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="font-semibold">{feature.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-right duration-700">
          {/* Logo for Mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CoachPro
            </span>
          </div>

          {/* Welcome Card */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to manage your coaching institute
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20">
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50">
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Password
                </TabsTrigger>
                <TabsTrigger
                  value="otp"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  OTP Login
                </TabsTrigger>
              </TabsList>

              {/* Password Login Tab */}
              <TabsContent value="password" className="space-y-4">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="password-email" className="text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        id="password-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={passwordForm.email}
                        onChange={handlePasswordChange}
                        className={`pl-11 h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          passwordErrors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                    </div>
                    {passwordErrors.email && (
                      <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                        className={`pl-11 pr-11 h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          passwordErrors.password
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.password && (
                      <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.password}
                      </div>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={onSwitchToForgotPassword}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-all"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Login Tab */}
              <TabsContent value="otp" className="space-y-4">
                <form onSubmit={handleSendOTP} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="otp-email" className="text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        id="otp-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={otpForm.email}
                        onChange={handleOtpChange}
                        className={`pl-11 h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          otpErrors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                    </div>
                    {otpErrors.email && (
                      <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3" />
                        {otpErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Info Message */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      We'll send a 6-digit verification code to your email
                      address.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                    disabled={isOtpLoading}
                  >
                    {isOtpLoading ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send OTP
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Sign Up Link */}
            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
                >
                  Sign up here
                </button>
              </p>
            </div> */}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        email={otpForm.email}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        purpose="login"
      />
    </div>
  );
}
