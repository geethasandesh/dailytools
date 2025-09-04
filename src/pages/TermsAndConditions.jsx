import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-base text-purple-200">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-8">
          <section>
            <h2 className="text-xl font-medium text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              By accessing and using Daily Tools, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">2. Use License</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Permission is granted to temporarily use Daily Tools for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="text-gray-300 text-sm space-y-1 ml-4">
              <li>• Modify or copy the materials</li>
              <li>• Use the materials for commercial purposes</li>
              <li>• Attempt to reverse engineer any software</li>
              <li>• Remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">3. Disclaimer</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              The materials on Daily Tools are provided on an 'as is' basis. Daily Tools makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">4. Limitations</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              In no event shall Daily Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Daily Tools, even if Daily Tools or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">5. Privacy</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your privacy is important to us. All file processing is done locally in your browser, and we do not store or transmit your files to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-white mb-4">6. Contact Information</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;