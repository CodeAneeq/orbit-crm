import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

const BarChartComponent = () => {
  const clientGrowthData = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 50 },
    { name: "Apr", value: 48 },
    { name: "May", value: 52 },
    { name: "Jun", value: 55 },
  ];

  return (
    <div className="gap-4 w-full">
      {/* Client Growth (Bar Chart) */}
      <div className="p-4  rounded-2xl   w-full">
        <h2 className="font-semibold">Client Growth</h2>
        <p className="text-2xl font-medium">+15%</p>
        <p className="text-green-600 text-sm mb-5">This Month +15%</p>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientGrowthData}>
                <XAxis dataKey="name"></XAxis>
                <YAxis hide></YAxis>
                <Tooltip></Tooltip>
                <Bar dataKey="value" fill="#6b7280" radius={[6, 6, 0, 0]}></Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent