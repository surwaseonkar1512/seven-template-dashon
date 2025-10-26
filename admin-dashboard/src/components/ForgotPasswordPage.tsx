import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { OTPVerificationModal } from "./OTPVerificationModal";
import {
  Mail,
  Lock,
  ArrowLeft,
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  GraduationCap,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

type Step = "email" | "otp" | "reset";

export function ForgotPasswordPage({
  onBackToLogin,
  onResetSuccess,
}: ForgotPasswordPageProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP Modal
  const [showOTPModal, setShowOTPModal] = useState(false);

  // Reset Password Form
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  const validateEmail = (email: string): string => {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Invalid email address"
      : "";
  };

  const validatePassword = (password: string): string => {
    return password.length < 8
      ? "Password must be at least 8 characters"
      : !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
      ? "Password must contain uppercase, lowercase, and number"
      : "";
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setShowOTPModal(true);
      toast.success("OTP sent to your email!");
    }, 1500);
  };

  // Step 2: Verify OTP
  const handleOTPVerify = async (otp: string) => {
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowOTPModal(false);
    setCurrentStep("reset");
    toast.success("OTP verified! Please set your new password.");
  };

  const handleResendOTP = () => {
    // Simulate resending OTP
    console.log("Resending OTP...");
  };

  // Step 3: Reset Password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev: any) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    const passwordError = validatePassword(passwordForm.password);

    if (passwordError) errors.password = passwordError;
    if (passwordForm.password !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error("Please fix all errors");
      return;
    }

    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password reset successful!");
      onResetSuccess();
    }, 1500);
  };

  const stepConfig = {
    email: {
      title: "Reset Password",
      subtitle: "Enter your email to receive verification code",
      icon: Mail,
      color: "from-green-600 to-emerald-600",
    },
    otp: {
      title: "Verify Identity",
      subtitle: "Check your email for verification code",
      icon: Shield,
      color: "from-blue-600 to-indigo-600",
    },
    reset: {
      title: "New Password",
      subtitle: "Create a strong, secure password",
      icon: KeyRound,
      color: "from-purple-600 to-pink-600",
    },
  };

  const currentConfig = stepConfig[currentStep];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTQgMTZ2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem0tMTYgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00LTEydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative z-10 max-w-lg space-y-8 animate-in fade-in slide-in-from-left duration-700">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight">CoachPro</h1>
              <p className="text-green-100 text-sm">Secure Account Recovery</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-5xl tracking-tight leading-tight">
                Don't Worry,
                <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  We've Got You
                </span>
              </h2>
              <p className="text-xl text-green-100 leading-relaxed">
                Password recovery is quick and secure. We'll help you get back
                to managing your institute in no time.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4 pt-4">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Secure Process</h3>
                    <p className="text-green-100">
                      Your security is our priority. We use industry-standard
                      encryption and multi-factor authentication to protect your
                      account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-center">
                  <div className="text-2xl font-bold mb-1">2-Step</div>
                  <div className="text-sm text-green-100">Verification</div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-center">
                  <div className="text-2xl font-bold mb-1">256-bit</div>
                  <div className="text-sm text-green-100">Encryption</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-right duration-700">
          {/* Logo for Mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              CoachPro
            </span>
          </div>

          {/* Header with Icon */}
          <div className="text-center space-y-4">
            <div
              className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${currentConfig.color} flex items-center justify-center shadow-lg animate-in zoom-in duration-500`}
            >
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {currentConfig.title}
              </h1>
              <p className="text-gray-600 mt-2">{currentConfig.subtitle}</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {(["email", "otp", "reset"] as Step[]).map((step, index) => {
              const stepIndex = ["email", "otp", "reset"].indexOf(step);
              const currentIndex = ["email", "otp", "reset"].indexOf(
                currentStep
              );
              const isCompleted = stepIndex < currentIndex;
              const isActive = step === currentStep;

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? `border-green-600 bg-green-600 text-white scale-110`
                        : isCompleted
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                        isCompleted ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-500/10 p-8 border border-white/20">
            {/* Step 1: Email Input */}
            {currentStep === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={`pl-11 h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all ${
                        emailError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                  </div>
                  {emailError && (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    We'll send a 6-digit verification code to this email
                    address.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {currentStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-700">
                    New Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <Input
                      id="new-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordForm.password}
                      onChange={handlePasswordChange}
                      className={`pl-11 pr-11 h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all ${
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
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with uppercase, lowercase, and
                    number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-700">
                    Confirm New Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`pl-11 pr-11 h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all ${
                        passwordErrors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword ? (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.confirmPassword}
                    </div>
                  ) : passwordForm.confirmPassword &&
                    passwordForm.password === passwordForm.confirmPassword ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 animate-in slide-in-from-top-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Passwords match
                    </div>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Back to Login Link */}
            <button
              type="button"
              onClick={onBackToLogin}
              className="flex items-center justify-center w-full mt-6 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        email={email}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        purpose="forgot-password"
      />
    </div>
  );
}
