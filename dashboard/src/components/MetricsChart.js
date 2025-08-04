import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function MetricsChart({ title, data, type }) {
  const renderContent = () => {
    switch (type) {
      case 'nodes':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Node Name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="CPU Usage" 
                fill="#0ea5e9" 
                name="CPU Usage"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="Memory Usage" 
                fill="#10b981" 
                name="Memory Usage"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pod-status':
        const statusCounts = data.reduce((acc, pod) => {
          acc[pod.Status] = (acc[pod.Status] || 0) + 1;
          return acc;
        }, {});
        
        const statusData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count
        }));

        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'pod-namespace':
        const namespaceCounts = data.reduce((acc, pod) => {
          acc[pod.Namespace] = (acc[pod.Namespace] || 0) + 1;
          return acc;
        }, {});
        
        const namespaceData = Object.entries(namespaceCounts)
          .map(([namespace, count]) => ({
            name: namespace,
            count: count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Show top 10 namespaces

        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={namespaceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip 
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#0ea5e9"
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="p-4 text-gray-500">No chart data available</div>;
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {title}
        </h3>
        {data.length > 0 ? (
          renderContent()
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}