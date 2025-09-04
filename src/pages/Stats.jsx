import React from 'react';

const Stats = () => {
  const stats = [
    { number: '8+', label: 'Powerful Tools', icon: '🛠️' },
    { number: '100%', label: 'Free to Use', icon: '🆓' },
    { number: '0', label: 'Downloads Required', icon: '📱' },
    { number: '24/7', label: 'Available', icon: '🌍' }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Trusted by Users Worldwide
          </h2>
          <p className="text-base text-purple-200">
            Join thousands who use Daily Tools for their everyday tasks
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <div className="text-xl mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-semibold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-purple-200">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;