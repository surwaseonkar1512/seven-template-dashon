import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { OTPVerificationModal } from "./OTPVerificationModal";
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({
  onSignupSuccess,
  onSwitchToLogin,
}: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    domainUrl: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value.trim().length < 3
          ? "Name must be at least 3 characters"
          : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email address"
          : "";
      case "mobile":
        return !/^[0-9]{10}$/.test(value.replace(/[^0-9]/g, ""))
          ? "Mobile number must be 10 digits"
          : "";
      case "password":
        return value.length < 8
          ? "Password must be at least 8 characters"
          : !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
          ? "Password must contain uppercase, lowercase, and number"
          : "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
      case "domainUrl":
        return !/^[a-z0-9-]+$/.test(value)
          ? "Only lowercase letters, numbers, and hyphens allowed"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      if (!file.type.match(/^image\/(jpg|jpeg|png)$/)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed");
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOTPModal(true);
      toast.success("OTP sent to your email!");
    }, 1500);
  };

  const handleOTPVerify = async (otp: string) => {
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowOTPModal(false);
    toast.success("Account created successfully!");
    onSignupSuccess();
  };

  const handleResendOTP = () => {
    // Simulate resending OTP
    console.log("Resending OTP...");
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTQgMTZ2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem0tMTYgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00IDB2Mmgydi0yaC0yem00LTEydjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative z-10 max-w-lg space-y-8 animate-in fade-in slide-in-from-left duration-700">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight">CoachPro</h1>
              <p className="text-purple-100 text-sm">Your Success Partner</p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl tracking-tight leading-tight">
              Start Your
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Journey Today
              </span>
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed">
              Join thousands of successful coaching institutes already using
              CoachPro
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 pt-4">
            {[
              {
                icon: Zap,
                title: "Quick Setup",
                desc: "Get your website live in under 10 minutes",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                desc: "99.9% uptime with enterprise security",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                desc: "Expert help whenever you need it",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 animate-in slide-in-from-left"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-purple-100">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: "500+", label: "Institutes" },
              { value: "10K+", label: "Students" },
              { value: "4.9★", label: "Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-right duration-700 my-8">
          {/* Logo for Mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CoachPro
            </span>
          </div>

          {/* Welcome Card */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join the future of coaching education
            </p>
          </div>

          {/* Signup Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-3 pb-2">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-all">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-purple-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-9 w-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Upload profile picture (JPG, PNG, max 2MB)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-11 h-11 bg-gray-50/50 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                        errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-11 h-11 bg-gray-50/50 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="1234567890"
                      value={formData.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-11 h-11 bg-gray-50/50 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                        errors.mobile
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.mobile}
                    </div>
                  )}
                </div>

                {/* Domain URL */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="domainUrl" className="text-gray-700">
                    Domain URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="domainUrl"
                      name="domainUrl"
                      placeholder="your-institute-name"
                      value={formData.domainUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-11 pr-40 h-11 bg-gray-50/50 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                        errors.domainUrl
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      .mycoaching.com
                    </span>
                  </div>
                  {errors.domainUrl && (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.domainUrl}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-11 pr-11 h-11 bg-gray-50/50 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                        errors.password
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
                  {errors.password && (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-11 pr-11 h-11 bg-gray-50/50 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${
                        errors.confirmPassword
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
                  {errors.confirmPassword ? (
                    <div className="flex items-center gap-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </div>
                  ) : formData.confirmPassword &&
                    formData.password === formData.confirmPassword ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 animate-in slide-in-from-top-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Passwords match
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-all"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        email={formData.email}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        purpose="signup"
      />
    </div>
  );
}
