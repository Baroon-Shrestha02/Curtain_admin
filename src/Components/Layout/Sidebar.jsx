import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Image,
  LogOut,
  PanelLeft,
  User,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../Utils/AuthContext";

const NAV_ITEMS = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Products", icon: Package, to: "/products" },
  { label: "Gallery", icon: Image, to: "/gallery" },
  { label: "Profile", icon: UserCircle, to: "/profile" },
];

const fullName = (u) =>
  [u?.firstname, u?.lastname].filter(Boolean).join(" ").trim() || "Account";

export default function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Log current user to the console for visibility.
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line no-console
      console.log("Logged user:", user);
    }
  }, [user]);

  // Decide initial + responsive state based on viewport width.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    const apply = (matches) => {
      setIsMobile(matches);
      setCollapsed(matches);
    };

    apply(mq.matches);

    const handler = (e) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const expanded = !collapsed;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      localStorage.removeItem("token");
    }
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  const displayName = fullName(user);
  const displayEmail = user?.email || "";

  return (
    <>
      {/* Mobile backdrop when the drawer is open */}
      {isMobile && expanded && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-30 bg-black/50"
        />
      )}

      <aside
        className={[
          "top-0 left-0 z-40 flex h-screen shrink-0 flex-col",
          "border-r border-neutral-200 bg-white text-neutral-700",
          "transition-[width,transform] duration-200 ease-in-out",
          isMobile ? "fixed" : "sticky",
          expanded ? "w-64" : "w-[72px]",
          isMobile && collapsed ? "-translate-x-full" : "translate-x-0",
        ].join(" ")}
      >
        {/* Top bar: brand + collapse toggle */}
        <div
          className={[
            "flex h-16 items-center border-b border-neutral-200 px-3",
            expanded ? "justify-between" : "justify-center",
          ].join(" ")}
        >
          {expanded && (
            <span className="whitespace-nowrap text-[15px] font-semibold text-neutral-900">
              Application
            </span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="flex items-center justify-center rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <PanelLeft size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => {
                if (isMobile) setCollapsed(true);
              }}
              title={!expanded ? label : undefined}
              className={({ isActive }) =>
                [
                  "mb-1 flex items-center gap-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  expanded ? "px-3 py-2.5" : "justify-center p-2.5",
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                ].join(" ")
              }
            >
              <Icon size={20} className="shrink-0" />
              {expanded && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-neutral-200 p-2">
          <button
            onClick={handleLogout}
            title={!expanded ? "Logout" : undefined}
            className={[
              "flex w-full items-center gap-3 rounded-lg text-sm font-medium whitespace-nowrap text-neutral-600 transition-colors",
              "hover:bg-red-50 hover:text-red-600",
              expanded ? "px-3 py-2.5" : "justify-center p-2.5",
            ].join(" ")}
          >
            <LogOut size={20} className="shrink-0" />
            {expanded && <span>Logout</span>}
          </button>
        </div>

        {/* User footer */}
        <NavLink
          to="/profile"
          onClick={() => {
            if (isMobile) setCollapsed(true);
          }}
          className={[
            "flex items-center gap-2.5 border-t border-neutral-200 p-3 hover:bg-neutral-50",
            expanded ? "justify-between" : "justify-center",
          ].join(" ")}
          title={!expanded ? displayName : undefined}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <User size={18} className="text-neutral-500" />
            </div>
            {expanded && (
              <div className="overflow-hidden leading-tight">
                <div className="whitespace-nowrap text-[13px] font-semibold text-neutral-900">
                  {displayName}
                </div>
                {displayEmail && (
                  <div className="truncate text-xs text-neutral-500 max-w-[160px]">
                    {displayEmail}
                  </div>
                )}
              </div>
            )}
          </div>
        </NavLink>
      </aside>

      {/* Floating open button for mobile when collapsed off-screen */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Open sidebar"
          className="fixed top-4 left-4 z-40 flex rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 shadow-sm"
        >
          <PanelLeft size={20} />
        </button>
      )}
    </>
  );
}
