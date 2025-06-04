import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import chart components
import { OverviewChart } from "@/components/charts/overview-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { PatientsChart } from "@/components/charts/patients-chart";
import { DepartmentChart } from "@/components/charts/department-chart";

export default function Home() {
  const { user } = useAuthStore();

  // Display finance charts only for finance and admin roles
  const showFinanceCharts = user?.role === "finance" || user?.role === "admin";

  // Display medical charts for medical staff and admin
  const showMedicalCharts = user?.role === "doctor" || user?.role === "nurse" || user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <section className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening at Mini Clinic today
            </p>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-3 gap-2 items-center">
            <div className="bg-white space-y-2 rounded-lg py-2 px-4 border border-primary hover:shadow-md transition-all">
              <div className="text-sm font-medium text-muted-foreground mb-1">Today's Appointments</div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-muted-foreground">
                <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-1.5 rounded mr-1">2 completed</span>
                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-1.5 rounded">3 upcoming</span>
              </div>
            </div>
            <div className="bg-white space-y-2 rounded-lg py-2 px-4 border border-primary hover:shadow-md transition-all">
              <div className="text-sm font-medium text-muted-foreground mb-1">New Patients</div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">
                <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-1.5 rounded">+1 since yesterday</span>
              </div>
            </div>
            <div className="bg-white space-y-2 rounded-lg py-2 px-4 border border-primary hover:shadow-md transition-all">
              <div className="text-sm font-medium text-muted-foreground mb-1">Pending Lab Results</div>
              <div className="text-2xl font-bold">7</div>
              <div className="text-xs text-muted-foreground">
                <span className="inline-block bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-1.5 rounded mr-1">2 urgent</span>
                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-1.5 rounded">5 routine</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Analytics Charts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medical Analytics - show to medical staff and admin */}
          {showMedicalCharts && (
            <>
              <OverviewChart />
              <PatientsChart />
            </>
          )}

          {/* Financial Analytics - show to finance staff and admin */}
          {showFinanceCharts && (
            <>
              <RevenueChart />
              <DepartmentChart />
            </>
          )}

          {/* If user has no role that should see charts, show a message */}
          {!showMedicalCharts && !showFinanceCharts && (
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics are only available to medical staff, finance staff, and administrators.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Quick Actions
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-6">
                <div
                  className={`${action.color} ${action.textColor} p-3 rounded-full w-fit mb-4`}
                >
                  {action.icon}
                </div>
                <h3 className="font-medium text-lg">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}
    </div>
  );
}
