import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Users,
  Check,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { getAllUsers } from "../../Services/UserMangment";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

interface HeaderProps {
  title: string;
  mode: any;
  onLogout?: () => void;
}

export function Header({ title, mode, onLogout }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // keep dropdown open while typing

  const { user } = useSelector((state: RootState) => state.auth); // 👈 get logged-in user


  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();

      // ✅ Filter: hide current logged-in user + remove admins
      const filtered = data.filter(
        (u: any) => u._id !== user?.user?._id && u.role !== "admin"
      );

      setUsers(filtered);

      const storedId = localStorage.getItem("selectedUserId");
      if (storedId) {
        const found = filtered.find((u: any) => u._id === storedId);
        if (found) setSelectedUser(found);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUserId", user._id);
    toast.success(`Switched to ${user.name}`);
    setOpen(false);
  };

  // ✅ Real-time filtered list
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "admin" ? "System Administration" : "Website Management"}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* 👥 User Dropdown with Search */}
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-3 py-2"
              >
                <Users className="h-4 w-4 text-blue-500" />
                <span className="truncate max-w-[120px]">
                  {selectedUser ? selectedUser.name : "Select User"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-72 p-2"
              align="end"
              forceMount
              onClick={(e: any) => e.stopPropagation()}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground pb-1">
                Select User
              </DropdownMenuLabel>

              {/* Search Bar */}
              <div className="relative mb-2">
                <Input
                  placeholder="Search user..."
                  className="px-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}

                  autoFocus
                />
              </div>

              {/* Filtered User List */}
              <div className="max-h-60 overflow-y-auto rounded-md border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <DropdownMenuItem
                      key={user._id}
                      className="flex justify-between items-center cursor-pointer px-3 py-2 hover:bg-accent rounded-md"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email || user.domainUrl}
                        </p>
                      </div>
                      {selectedUser?._id === user._id && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No users found
                  </p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 🌗 Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* 👤 Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {mode === "admin" ? "AD" : "CO"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {mode === "admin" ? "Admin User" : "Coach Name"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {mode === "admin"
                      ? "admin@example.com"
                      : "coach@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onLogout && (
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
