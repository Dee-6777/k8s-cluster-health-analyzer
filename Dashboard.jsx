import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [view, setView] = useState("nodes");

  useEffect(() => {
    fetch(`http://localhost:8000/${view}`)
      .then((res) => res.json())
      .then((data) => setMetrics(data));
  }, [view]);

  const isNodes = view === "nodes";
  const xKey = isNodes ? "Node Name" : "Pod Name";
  const cpuKey = isNodes ? "CPU Usage" : "CPU Usage (nanos)";
  const memKey = isNodes ? "Memory Usage" : "Memory Usage (KiB)";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kubernetes Cluster Health</h1>
      <div className="mb-4">
        <button onClick={() => setView("nodes")}>Nodes</button>
        <button onClick={() => setView("pods")}>Pods</button>
      </div>
      <BarChart width={800} height={400} data={metrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={cpuKey} fill="#8884d8" />
        <Bar dataKey={memKey} fill="#82ca9d" />
      </BarChart>
    </div>
  );
}