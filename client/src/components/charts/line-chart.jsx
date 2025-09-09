import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const LineChartComponent = () => {
  const clientGrowthData = [
    { name: "Q1", value: 10 },
    { name: "Q2", value: 55 },
    { name: "Q3", value: 20 },
    { name: "Q4", value: 55 },
  ];

  return (
    <div className="gap-4 w-full">
      {/* Client Growth (Bar Chart) */}
      <div className="p-4  rounded-2xl max-w-full">
        <h2 className="font-semibold">Lead Conversation Rate</h2>
        <h4 className="font-medium text-2xl">-5%</h4>
        <p className="text-green-600 text-sm mb-5">This Quarter +10%</p>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name" width="100%"></XAxis>
                <YAxis hide></YAxis>
                <Tooltip></Tooltip>
                <Line type="monotone" dataKey="value" stroke="#6b7280" strokeWidth={2} dot={false}></Line>
            </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent