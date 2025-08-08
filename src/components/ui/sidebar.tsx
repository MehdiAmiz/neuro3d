import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  const location = useLocation();

    return (
    <nav className="space-y-1 px-4">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
            location.pathname === item.href
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
};