import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kubernetes Cluster Health</h1>
      <BarChart width={800} height={400} data={metrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Node Name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="CPU Usage (cores)" fill="#8884d8" />
        <Bar dataKey="Memory Usage (MB)" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
