import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold mt-1 text-gray-800">{value}</p>
      <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? '↑' : '↓'}
        <span className="ml-1 text-sm">vs last week</span>
      </div>
    </div>
  );
};

export default StatCard;
