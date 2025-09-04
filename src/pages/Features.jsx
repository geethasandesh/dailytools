import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'All tools work instantly in your browser with no waiting time'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your files are processed locally and never stored on our servers'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile'
    },
    {
      icon: '🆓',
      title: 'Completely Free',
      description: 'No subscriptions, no hidden fees, no account required'
    },
    {
      icon: '🎯',
      title: 'Easy to Use',
      description: 'Simple, intuitive interface that anyone can use'
    },
    {
      icon: '🔄',
      title: 'Always Updated',
      description: 'Regular updates with new tools and improvements'
    }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Why Choose Daily Tools?
          </h2>
          <p className="text-base text-purple-200 max-w-2xl mx-auto">
            Built with modern technology to provide the best user experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;