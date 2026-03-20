import React, { useEffect, useState } from "react";

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
    uniqueConnectionDevices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://api-g.lacs.cc/api/admt/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://admt.lacs.cc",
          },
        });
        const result = await response.json();
        if (result.success && result.data) {
          setStats({
            totalUsage: parseInt(result.data.totalUsage) || 0,
            uniqueDevices: parseInt(result.data.uniqueDevices) || 0,
            totalConnections: parseInt(result.data.totalConnections) || 0,
            uniqueConnectionDevices:
              parseInt(result.data.uniqueConnectionDevices) || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({
          totalUsage: 10000,
          uniqueDevices: 5000,
          totalConnections: 50000,
          uniqueConnectionDevices: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsItems = [
    { label: "累计使用次数", value: stats.totalUsage },
    { label: "使用人数", value: stats.uniqueDevices },
    { label: "管理设备", value: stats.totalConnections },
    { label: "设备数量", value: stats.uniqueConnectionDevices },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12 md:gap-16 text-center max-w-5xl mx-auto">
      {statsItems.map((item, index) => (
        <div
          key={index}
          className="p-4 sm:p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-black"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {!loading ? <>{formatNumber(item.value)}+</> : <span>...</span>}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
