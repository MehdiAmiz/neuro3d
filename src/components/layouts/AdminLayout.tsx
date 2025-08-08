import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Package, CreditCard, Settings, BarChart3, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("adminAuthenticated") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "koliuytreza") {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="w-4 h-4" />,
      href: "/admin"
    },
    {
      title: "Users",
      icon: <Users className="w-4 h-4" />,
      href: "/admin/users"
    },
    {
      title: "Credit Packs",
      icon: <Package className="w-4 h-4" />,
      href: "/admin/credit-packs"
    },
    {
      title: "Transactions",
      icon: <CreditCard className="w-4 h-4" />,
      href: "/admin/transactions"
    },
    {
      title: "Settings",
      icon: <Settings className="w-4 h-4" />,
      href: "/admin/settings"
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-black/20 backdrop-blur-xl rounded-xl border border-white/10">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-black/20"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Access Admin Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <ScrollArea className="flex-1">
            <Sidebar items={sidebarItems} />
          </ScrollArea>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};