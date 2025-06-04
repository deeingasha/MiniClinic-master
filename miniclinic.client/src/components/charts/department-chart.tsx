import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", pharmacy: 31, laboratory: 24, general: 40, pediatrics: 22 },
  { name: "Feb", pharmacy: 28, laboratory: 26, general: 42, pediatrics: 18 },
  { name: "Mar", pharmacy: 35, laboratory: 30, general: 38, pediatrics: 25 },
  { name: "Apr", pharmacy: 40, laboratory: 32, general: 45, pediatrics: 30 },
  { name: "May", pharmacy: 42, laboratory: 36, general: 48, pediatrics: 28 },
  { name: "Jun", pharmacy: 38, laboratory: 30, general: 51, pediatrics: 32 },
];

export function DepartmentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Performance</CardTitle>
        <CardDescription>
          Patient visits by department over 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPharmacy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorLaboratory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorGeneral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPediatrics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="pharmacy" 
                stroke="#f43f5e" 
                fillOpacity={1}
                fill="url(#colorPharmacy)" 
                name="Pharmacy"
              />
              <Area 
                type="monotone" 
                dataKey="laboratory" 
                stroke="#f59e0b" 
                fillOpacity={1}
                fill="url(#colorLaboratory)" 
                name="Laboratory"
              />
              <Area 
                type="monotone" 
                dataKey="general" 
                stroke="#3b82f6" 
                fillOpacity={1}
                fill="url(#colorGeneral)" 
                name="General"
              />
              <Area 
                type="monotone" 
                dataKey="pediatrics" 
                stroke="#10b981" 
                fillOpacity={1}
                fill="url(#colorPediatrics)" 
                name="Pediatrics"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
