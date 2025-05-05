import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Chart = () => {
  const data = [
    { name: "Total Cases", value: 704753890 },
    { name: "Total Deaths", value: 7010681 },
    { name: "Total Recovered", value: 675619811 },
    { name: "Active Cases", value: 22123398 },
    { name: "Critical Cases", value: 34794 },
    { name: "Cases Per Million", value: 90413 },
    { name: "Deaths Per Million", value: 899.4 },
    { name: "Tests", value: 7026505313 },
    { name: "Tests Per Million", value: 884400.59 },
    { name: "Population", value: 7944935131 },
    { name: "Active Per Million", value: 2784.59 },
    { name: "Recovered Per Million", value: 85037.8 },
    { name: "Critical Per Million", value: 4.38 },
    { name: "Affected Countries", value: 231 },
  ];

  const formatValue = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 border border-slate-700 rounded-lg shadow-lg">
          <p className="font-bold text-slate-200">{label}</p>
          <p className="text-blue-400">
            Value: {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-900 text-slate-200 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center text-blue-400">
          COVID-19 Global Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                className="opacity-30"
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#475569"
              />
              <YAxis
                tickFormatter={formatValue}
                width={80}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#475569"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  color: "#94a3b8",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: "#60a5fa", r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chart;
