import React, { useEffect, useState } from 'react';
import CountUp from './reactbits/CountUp';

interface StatsData {
  totalUsage: number;
  uniqueDevices: number;
  totalConnections: number;
  uniqueConnectionDevices: number;
}

const StatsCounter: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsage: 0,
    uniqueDevices: 0,
    totalConnections: 0,
    uniqueConnectionDevices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api-g.lacs.cc/api/admt/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://admt.lacs.cc'
          }
        });
        const result = await response.json();
        if (result.success && result.data) {
          // Parse values to numbers to ensure CountUp works correctly
          setStats({
            totalUsage: parseInt(result.data.totalUsage) || 0,
            uniqueDevices: parseInt(result.data.uniqueDevices) || 0,
            totalConnections: parseInt(result.data.totalConnections) || 0,
            uniqueConnectionDevices: parseInt(result.data.uniqueConnectionDevices) || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to placeholders if API fails
        setStats({
          totalUsage: 10000,
          uniqueDevices: 5000,
          totalConnections: 50000,
          uniqueConnectionDevices: 3000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsItems = [
    { label: '累计使用次数', value: stats.totalUsage },
    { label: '使用人数', value: stats.uniqueDevices },
    { label: '管理设备次数', value: stats.totalConnections },
    { label: '设备数量', value: stats.uniqueConnectionDevices }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 text-center">
      {statsItems.map((item, index) => (
        <div key={index} className="p-6 transform hover:scale-105 transition-transform duration-400">
          <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4" data-scroll-color="gradient-text">
            {!loading ? (
              <>
                <CountUp to={item.value} separator="," duration={2} />+
              </>
            ) : (
              <span>...</span>
            )}
          </div>
          <div className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
