import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready':
      case 'running':
      case 'succeeded':
        return {
          icon: CheckCircleIcon,
          classes: 'bg-green-100 text-green-800',
          iconClasses: 'text-green-500'
        };
      case 'pending':
        return {
          icon: ExclamationTriangleIcon,
          classes: 'bg-yellow-100 text-yellow-800',
          iconClasses: 'text-yellow-500'
        };
      case 'failed':
      case 'not ready':
        return {
          icon: XCircleIcon,
          classes: 'bg-red-100 text-red-800',
          iconClasses: 'text-red-500'
        };
      default:
        return {
          icon: ExclamationTriangleIcon,
          classes: 'bg-gray-100 text-gray-800',
          iconClasses: 'text-gray-500'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      <Icon className={`-ml-0.5 mr-1.5 h-2 w-2 ${config.iconClasses}`} />
      {status}
    </span>
  );
};

export default function MetricsTable({ title, data, type }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter data based on search term
  const filteredData = data.filter(item => {
    const searchString = Object.values(item).join(' ').toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatValue = (key, value) => {
    if (key.includes('Status')) {
      return <StatusBadge status={value} />;
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value || 'N/A';
  };

  const getColumns = () => {
    if (type === 'nodes') {
      return [
        { key: 'Node Name', label: 'Node Name' },
        { key: 'Status', label: 'Status' },
        { key: 'CPU Capacity', label: 'CPU Capacity' },
        { key: 'CPU Usage', label: 'CPU Usage' },
        { key: 'Memory Capacity', label: 'Memory Capacity' },
        { key: 'Memory Usage', label: 'Memory Usage' }
      ];
    } else {
      return [
        { key: 'Namespace', label: 'Namespace' },
        { key: 'Pod Name', label: 'Pod Name' },
        { key: 'Status', label: 'Status' },
        { key: 'CPU Usage (nanos)', label: 'CPU Usage (nanos)' },
        { key: 'Memory Usage (KiB)', label: 'Memory Usage (KiB)' }
      ];
    }
  };

  const columns = getColumns();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title} ({filteredData.length})
          </h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-kubernetes-500 focus:border-kubernetes-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortField === column.key && (
                        <span className="text-kubernetes-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {formatValue(column.key, item[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No results found for your search.' : 'No data available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}