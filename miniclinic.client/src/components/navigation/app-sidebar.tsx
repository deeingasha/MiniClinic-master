import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  Settings,
  LayoutDashboard,
  Stethoscope,
  Receipt,
  ShieldAlert,
  BarChart3,
  LockKeyhole,
  Mail,
  PackageOpen,
  ChevronDown,
  LogOut,
  Users,
  UserPlus,
  Pill,
  FileSpreadsheet,
  Mail as MailIcon,
  MessageSquare,
  FlaskConical,
} from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { text: "Home", path: "/", icon: <LayoutDashboard size={20} /> },
  {
    text: "Parameter Settings",
    path: "/settings",
    icon: <Settings size={20} />,
    children: [
      {
        text: "Clinic Information",
        path: "/settings/clinic",
        icon: <HomeIcon size={18} />,
      },
      {
        text: "Departments",
        path: "/settings/departments",
        icon: <Users size={18} />,
      },
      {
        text: "Drug Types",
        path: "/settings/drug-types",
        icon: <Pill size={18} />,
      },
      {
        text: "Lab Reagent",
        path: "/settings/lab-reagents",
        icon: <FlaskConical size={18} />,
      },
      {
        text: "Sale Factor",
        path: "/settings/sale-factors",
        icon: <Receipt size={18} />,
      },
      { text: "Email Settings", path: "/settings/email", icon: <MailIcon size={18} /> },
      { text: "Sms Settings", path: "/settings/sms", icon: <MessageSquare size={18} /> },
      { text: "Bank Settings", path: "/settings/bank", icon: <FileSpreadsheet size={18} /> },
    ],
  },
  {
    text: "Healthcare Management",
    path: "/healthcare",
    icon: <Stethoscope size={20} />,
    children: [
      {
        text: "Entity Registration",
        path: "/healthcare/registration",
        icon: <UserPlus size={18} />,
      },
      {
        text: "Treatment Dates",
        path: "/healthcare/treatment-dates",
        icon: <Users size={18} />,
      },
    ],
  },
  {
    text: "Pharmacy",
    path: "/pharmacy",
    icon: <Pill size={20} />,
    children: [
        {
            text: "Drug Entry",
            path: "/pharmacy/drug-entry",
            icon: <Pill size={18} />,
        },
        {
            text: "LPO",
            path: "/pharmacy/purchase-orders",
            icon: <FileSpreadsheet size={18} />,
        },
        {
            text: "Receive Drugs",
            path: "/pharmacy/receive-drugs",
            icon: <PackageOpen size={18} />,
        },
        //purchase-order
        // {
        //     text: "Purchase Orders",
        //     path: "/pharmacy/purchase-orders",
        //     icon: <FileSpreadsheet size={18} />,
        // },
    ]
  },
  { text: "Inventory Control", path: "/inventory", icon: <PackageOpen size={20} /> },
  { text: "Finance", path: "/finance", icon: <Receipt size={20} /> },
  {
    text: "System Administration",
    path: "/admin",
    icon: <ShieldAlert size={20} />,
    children: [
      {
        text: "Consultations",
        path: "/admin/consultations",
        icon: <Stethoscope size={18} />,
      },
      { text: "Pharmacy", path: "/admin/pharmacy", icon: <Pill size={18} /> },
      { text: "Lab Tests", path: "/admin/lab-tests", icon: <FlaskConical size={18} /> },
    ],
  },
  { text: "Email / Sms", path: "/communications", icon: <Mail size={20} /> },
  { text: "Reports", path: "/reports", icon: <BarChart3 size={20} /> },
  { text: "Change Password", path: "/account/password", icon: <LockKeyhole size={20} /> },
];

export const AppSidebar = ({ collapsed = false }: { collapsed?: boolean; toggleCollapse?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleSubmenu = (path: string) => {
    setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Automatically open the parent menu when a child is active
  const isSubmenuOpen = (path: string) => {
    if (openItems[path] !== undefined) {
      return openItems[path];
    }

    const item = menuItems.find(item => item.path === path);
    if (item?.children) {
      return item.children.some(child => isActive(child.path));
    }

    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={cn(
        "h-full bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="text-lg font-bold text-sidebar-primary">Mini Clinic</div>
            )}
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isItemActive = isActive(item.path);
              const isOpen = isSubmenuOpen(item.path);

              return hasChildren ? (
                <Collapsible.Root
                  key={item.path}
                  open={collapsed ? false : isOpen}
                  className={cn(
                    "rounded-md overflow-hidden",
                    isItemActive && !collapsed ? "bg-sidebar-accent/10" : ""
                  )}
                >
                  <Collapsible.Trigger
                    className={cn(
                      "flex cursor-pointer items-center w-full py-2 px-3 rounded-md",
                      isItemActive ? "text-sidebar-primary" : "text-sidebar-foreground hover:text-sidebar-primary",
                      "transition-colors duration-200",
                      collapsed ? "justify-center" : "justify-between"
                    )}
                    onClick={() => !collapsed && toggleSubmenu(item.path)}
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "flex items-center justify-start text-nowrap",
                        isItemActive ? "text-sidebar-primary" : "text-sidebar-foreground"
                      )}>
                        {item.icon}
                      </div>
                      {!collapsed && <span className="ml-3 text-nowrap text-sm">{item.text}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          isOpen ? "transform rotate-180" : ""
                        )}
                      />
                    )}
                  </Collapsible.Trigger>

                  <Collapsible.Content className={cn(
                    "transition-all duration-200 ease-in-out",
                    collapsed ? "hidden" : "pl-10 pr-2 py-1 space-y-1"
                  )}>
                    {item.children?.map((child) => (
                      <button
                        key={child.path}
                        className={cn(
                          "flex cursor-pointer items-center w-full text-left py-2 px-3 rounded-md text-sm",
                          isActive(child.path)
                            ? "text-sidebar-primary bg-sidebar-primary/10"
                            : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/5",
                          "transition-colors duration-200 group"
                        )}
                        onClick={() => navigate(child.path)}
                      >
                        <div className="mr-2">{child.icon}</div>
                        <span>{child.text}</span>
                      </button>
                    ))}
                  </Collapsible.Content>
                </Collapsible.Root>
              ) : (
                <button
                  key={item.path}
                  className={cn(
                    "flex items-center w-full cursor-pointer text-left py-2 px-3 rounded-md",
                    isActive(item.path)
                      ? "text-sidebar-primary bg-sidebar-primary/20"
                      : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/5",
                    "transition-colors duration-200",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <div className={cn(
                    "flex items-center justify-center",
                    isActive(item.path) ? "text-sidebar-primary" : "text-sidebar-foreground"
                  )}>
                    {item.icon}
                  </div>
                  {!collapsed && <span className="ml-3 text-sm">{item.text}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 border-t border-sidebar-border mt-auto">
        <button
          className={cn(
            "flex items-center w-full text-left py-2 px-3 rounded-md",
            "text-sidebar-foreground hover:text-destructive hover:bg-destructive/10",
            "transition-colors duration-200",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3 text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};
