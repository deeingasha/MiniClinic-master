import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/navigation/app-header";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { useState } from "react";
import { ThemeProvider } from "next-themes";

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />
        
        <main 
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out`}
        >
          <AppHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default AppLayout;