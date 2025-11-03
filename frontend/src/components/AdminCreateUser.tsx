import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  User,
  Upload,
  Eye,
  EyeOff,
  Lock,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { adminCreateUser } from "../../Services/UserMangment";

export function AdminCreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
    domainUrl: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // ---------- Validation ----------
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value.trim().length < 3 ? "Name must be at least 3 characters" : "";
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
      case "role":
        return !value ? "Please select a role" : "";

      default:
        return "";
    }
  };

  // ---------- Handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
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

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview("");
  };

  // ---------- Submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      setIsLoading(true);

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("mobile", formData.mobile);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      payload.append("domainUrl", formData.domainUrl);
      if (avatar) payload.append("avatar", avatar);

      const res = await adminCreateUser(payload);

      toast.success(res.message || "User created successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        role: "",
        password: "",
        domainUrl: "",
      });
      setAvatar(null);
      setAvatarPreview("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- JSX ----------
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create New User</h2>
          <p className="text-muted-foreground">Add a new user to the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Fill in the details to create a new user account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-3 pb-4 border-b">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                {!avatarPreview ? (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Upload className="h-5 w-5 text-white" />
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute bottom-0 right-0 h-10 w-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <span className="text-white text-xl leading-none">×</span>
                  </button>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Profile Picture</p>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Enter full name" className={errors.name ? "border-red-500" : ""} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="user@example.com" className={errors.email ? "border-red-500" : ""} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div>
                <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} onBlur={handleBlur} placeholder="1234567890" className={errors.mobile ? "border-red-500" : ""} />
                {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
              </div>

              {/* Domain URL */}
              <div>
                <Label htmlFor="domainUrl">Domain URL</Label>
                <Input
                  id="domainUrl"
                  name="domainUrl"
                  value={formData.domainUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="example.com"
                  className={errors.domainUrl ? "border-red-500" : ""}
                />
                {errors.domainUrl && (
                  <p className="text-xs text-red-500 mt-1">{errors.domainUrl}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">User Role <span className="text-red-500">*</span></Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className={`mt-1 ${errors.role ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User (Coach)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
              </div>

              {/* Password */}
              <div className="">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* Role Info Box */}
            {formData.role === "admin" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-medium text-yellow-900">Admin Role Selected</p>
                <p className="text-sm text-yellow-800 mt-1">
                  This user will have full access to all system features.
                </p>
              </div>
            )}

            {formData.role === "user" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900">User (Coach) Role Selected</p>
                <p className="text-sm text-blue-800 mt-1">
                  This user can manage their own coaching website and templates.
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
