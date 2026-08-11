import React, { useEffect, useState } from "react";
import { SITE_CONFIG } from '@/config/site';

const StatsCounter: React.FC = () => {
  const [statsData, setStatsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const { stats } = SITE_CONFIG;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(stats.apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Origin: SITE_CONFIG.url,
          },
        });
        const result = await response.json();
        if (result.success && result.data) {
          setStatsData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [stats.apiUrl]);

  const formatNumber = (val: any) => {
    const num = typeof val === 'string' ? parseInt(val) : val;
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const statKeys: Record<string, string> = {
    totalUsage: "statUsage",
    uniqueDevices: "statDevices",
    totalConnections: "statConnections",
    uniqueConnectionDevices: "statOnlineDevices",
  };

  const statSuffixKeys: Record<string, string> = {
    totalUsage: "statUsageSuffix",
    uniqueDevices: "statDevicesSuffix",
    totalConnections: "statConnectionsSuffix",
    uniqueConnectionDevices: "statOnlineDevicesSuffix",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12 md:gap-16 text-center max-w-5xl mx-auto">
      {stats.items.map((item: any, index: number) => (
        <div
          key={index}
          className="p-4 sm:p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-black"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {!loading ? (
              <>
                {formatNumber(statsData[item.key] || item.value)}
                <span data-i18n-key={statSuffixKeys[item.key]}>{item.suffix}</span>
              </>
            ) : (
              <span>...</span>
            )}
          </div>
          <div 
            className="text-sm text-gray-500 dark:text-gray-400 font-medium"
            data-i18n-key={statKeys[item.key]}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
