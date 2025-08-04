import React, { useState, useEffect } from 'react';
import { 
  ServerIcon, 
  CubeIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import MetricsChart from './MetricsChart';
import MetricsTable from './MetricsTable';
import StatusCard from './StatusCard';

const API_BASE_URL = 'http://localhost:8000';

export default function Dashboard() {
  const [nodes, setNodes] = useState([]);
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [nodesResponse, podsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/nodes`),
        fetch(`${API_BASE_URL}/pods`)
      ]);

      if (!nodesResponse.ok || !podsResponse.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const nodesData = await nodesResponse.json();
      const podsData = await podsResponse.json();

      setNodes(nodesData);
      setPods(podsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate summary statistics
  const nodeStats = {
    total: nodes.length,
    ready: nodes.filter(node => node.Status === 'Ready').length,
    notReady: nodes.filter(node => node.Status === 'Not Ready').length
  };

  const podStats = {
    total: pods.length,
    running: pods.filter(pod => pod.Status === 'Running').length,
    pending: pods.filter(pod => pod.Status === 'Pending').length,
    failed: pods.filter(pod => pod.Status === 'Failed').length,
    succeeded: pods.filter(pod => pod.Status === 'Succeeded').length
  };

  const namespaces = [...new Set(pods.map(pod => pod.Namespace))];

  if (loading && nodes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-kubernetes-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cluster data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchData}
            className="bg-kubernetes-600 text-white px-4 py-2 rounded-lg hover:bg-kubernetes-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-kubernetes-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Kubernetes Cluster Health Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
                </p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-kubernetes-600 text-white rounded-lg hover:bg-kubernetes-700 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'nodes', name: 'Nodes', icon: ServerIcon },
              { id: 'pods', name: 'Pods', icon: CubeIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-kubernetes-500 text-kubernetes-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatusCard
                title="Total Nodes"
                value={nodeStats.total}
                icon={ServerIcon}
                color="blue"
                subtitle={`${nodeStats.ready} ready, ${nodeStats.notReady} not ready`}
              />
              <StatusCard
                title="Total Pods"
                value={podStats.total}
                icon={CubeIcon}
                color="green"
                subtitle={`${podStats.running} running`}
              />
              <StatusCard
                title="Namespaces"
                value={namespaces.length}
                icon={CubeIcon}
                color="purple"
                subtitle="Active namespaces"
              />
              <StatusCard
                title="Cluster Health"
                value={nodeStats.notReady === 0 ? "Healthy" : "Issues"}
                icon={nodeStats.notReady === 0 ? CheckCircleIcon : ExclamationTriangleIcon}
                color={nodeStats.notReady === 0 ? "green" : "red"}
                subtitle={nodeStats.notReady === 0 ? "All nodes ready" : `${nodeStats.notReady} nodes not ready`}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsChart 
                title="Node Resource Usage" 
                data={nodes} 
                type="nodes" 
              />
              <MetricsChart 
                title="Pod Status Distribution" 
                data={pods} 
                type="pod-status" 
              />
            </div>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <MetricsChart 
              title="Node Resource Usage" 
              data={nodes} 
              type="nodes" 
            />
            <MetricsTable 
              title="Node Details" 
              data={nodes} 
              type="nodes" 
            />
          </div>
        )}

        {activeTab === 'pods' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsChart 
                title="Pod Status Distribution" 
                data={pods} 
                type="pod-status" 
              />
              <MetricsChart 
                title="Pods by Namespace" 
                data={pods} 
                type="pod-namespace" 
              />
            </div>
            <MetricsTable 
              title="Pod Details" 
              data={pods} 
              type="pods" 
            />
          </div>
        )}
      </main>
    </div>
  );
}