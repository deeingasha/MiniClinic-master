import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", consultations: 5, waitlist: 2 },
  { name: "Tue", consultations: 7, waitlist: 3 },
  { name: "Wed", consultations: 10, waitlist: 4 },
  { name: "Thu", consultations: 8, waitlist: 2 },
  { name: "Fri", consultations: 12, waitlist: 5 },
  { name: "Sat", consultations: 6, waitlist: 1 },
  { name: "Sun", consultations: 3, waitlist: 0 },
];

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Consultations</CardTitle>
        <CardDescription>
          Patient consultations for the current week
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <Tooltip />
              <Bar 
                dataKey="consultations" 
                fill="rgba(59, 130, 246, 0.8)" 
                radius={[4, 4, 0, 0]} 
                name="Consultations" 
              />
              <Bar 
                dataKey="waitlist" 
                fill="rgba(245, 158, 11, 0.8)" 
                radius={[4, 4, 0, 0]} 
                name="Waitlist" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
