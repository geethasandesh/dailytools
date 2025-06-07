import React, { useState } from 'react';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    education: [],
    experience: [],
    skills: [],
  });

  const [activeSection, setActiveSection] = useState('personal');

  const sections = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'education', name: 'Education' },
    { id: 'experience', name: 'Work Experience' },
    { id: 'skills', name: 'Skills' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 font-medium ${
                  activeSection === section.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.personalInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, name: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.personalInfo.location}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, location: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeSection === 'education' && (
          <div>
            <button
              onClick={() => setFormData({
                ...formData,
                education: [...formData.education, { school: '', degree: '', year: '' }]
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Education
            </button>
            {/* Education form fields will go here */}
          </div>
        )}

        {activeSection === 'experience' && (
          <div>
            <button
              onClick={() => setFormData({
                ...formData,
                experience: [...formData.experience, { company: '', position: '', duration: '' }]
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Experience
            </button>
            {/* Experience form fields will go here */}
          </div>
        )}

        {activeSection === 'skills' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Add a skill"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const skill = e.target.value.trim();
                    if (skill) {
                      setFormData({
                        ...formData,
                        skills: [...formData.skills, skill]
                      });
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => setFormData({
                      ...formData,
                      skills: formData.skills.filter((_, i) => i !== index)
                    })}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => {
              // TODO: Implement preview functionality
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Preview
          </button>
          <button
            onClick={() => {
              // TODO: Implement download functionality
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder; 