import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartProps {
  data: Record<string, number>;
  type: 'bar' | 'pie' | 'line';
  title: string;
  className?: string;
}

const COLORS = [
  'hsl(187, 85%, 53%)',
  'hsl(262, 83%, 58%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(200, 85%, 50%)',
  'hsl(280, 70%, 55%)',
  'hsl(160, 70%, 45%)',
];

export function CrimeChart({ data, type, title, className }: ChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.length > 12 ? name.substring(0, 12) + '...' : name,
    fullName: name,
    value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.fullName}</p>
          <p className="text-sm text-primary">{payload[0].value} incidents</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-6",
      "animate-fade-in opacity-0",
      className
    )} style={{ animationDelay: '200ms' }}>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="hsl(187, 85%, 53%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : type === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(187, 85%, 53%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(187, 85%, 53%)', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
