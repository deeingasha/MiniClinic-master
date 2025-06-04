import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "Initial Consultation", value: 45, color: "#3b82f6" },
  { name: "Follow-up Visit", value: 32, color: "#10b981" },
  { name: "Treatment", value: 18, color: "#f59e0b" },
  { name: "Referral", value: 5, color: "#ef4444" },
];

export function PatientsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Distribution</CardTitle>
        <CardDescription>
          Types of patient visits in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} patients`, name]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
