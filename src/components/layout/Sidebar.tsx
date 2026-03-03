import { NavLink, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Smile,
  Target,
  Sparkles,
  CreditCard,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/services/authApi";
import { Badge } from "@/components/ui/Badge";

const navItems = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/mood", icon: Smile, label: "Mood" },
  { to: "/app/habits", icon: Target, label: "Habits" },
  { to: "/app/ai", icon: Sparkles, label: "AI Insights" },
  { to: "/app/billing", icon: CreditCard, label: "Billing" },
  { to: "/app/profile", icon: User, label: "Profile" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutApi({ refreshToken }).unwrap();
    } catch {
      // logout locally regardless
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleNavClick = () => {
    // Close drawer on mobile after navigating
    onClose();
  };

  const planVariant = {
    free: "default" as const,
    pro: "purple" as const,
    enterprise: "info" as const,
  };

  return (
    <aside
      className={clsx(
        // Base styles
        "h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-30 transition-transform duration-300 ease-in-out",
        // Desktop: always visible, static in flow
        "lg:relative lg:translate-x-0 lg:w-64",
        // Mobile: fixed drawer, slides in/out
        "fixed w-72",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Logo + mobile close button */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="text-lg font-bold text-brand-400">PulseBloom</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/20"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800",
              )
            }
          >
            <Icon size={18} />
            {label}
            {label === "AI Insights" && user?.plan === "free" && (
              <Badge variant="purple" size="sm" className="ml-auto">
                Pro
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {user.name ?? "User"}
              </p>
              {user.plan && (
                <Badge variant={planVariant[user.plan]} size="sm">
                  {user.plan}
                </Badge>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
