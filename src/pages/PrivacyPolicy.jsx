import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-base text-purple-200">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-8">
          <section>
            <h2 className="text-xl font-medium text-white mb-4">Information We Collect</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Daily Tools is designed with privacy in mind. We do not collect, store, or transmit any personal files or data that you process using our tools. All file processing happens locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">How We Use Information</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              We may collect basic analytics data to improve our service, including:
            </p>
            <ul className="text-gray-300 text-sm space-y-1 ml-4">
              <li>• Page views and tool usage statistics</li>
              <li>• Browser type and version</li>
              <li>• General location (country/region)</li>
              <li>• Device type (mobile, desktop, tablet)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">File Processing</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              All file processing (image editing, video conversion, etc.) happens entirely in your browser using client-side JavaScript. Your files never leave your device and are not uploaded to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">Cookies</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We may use cookies to enhance your experience and remember your preferences. You can disable cookies in your browser settings if you prefer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">Third-Party Services</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              We may use third-party analytics services to understand how our tools are used. These services may collect anonymous usage data according to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">Data Security</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Since we don't store your files or personal data, there's no risk of data breaches involving your content. All processing happens securely in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;