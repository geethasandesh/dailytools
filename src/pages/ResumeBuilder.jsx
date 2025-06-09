import React, { useState, useRef } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import ResumePDF from '../components/ResumePDF';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: '',
      profileImage: null,
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    references: [],
    customSections: [],
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [atsScore, setAtsScore] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      category: 'ATS-Optimized',
      score: 95,
      thumbnail: '🔄',
      description: 'Clean, modern design with high ATS compatibility',
      features: ['Single column layout', 'Clear section hierarchy', 'Optimized for ATS']
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'Premium',
      score: 92,
      thumbnail: '👔',
      description: 'Professional design for senior positions',
      features: ['Two-column layout', 'Emphasis on achievements', 'Professional typography']
    },
    {
      id: 'creative',
      name: 'Creative',
      category: 'Premium',
      score: 88,
      thumbnail: '🎨',
      description: 'Stand out with a creative design',
      features: ['Unique layout', 'Color accents', 'Visual elements']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'ATS-Optimized',
      score: 97,
      thumbnail: '📄',
      description: 'Simple and effective design',
      features: ['Clean typography', 'Maximum readability', 'Highest ATS score']
    }
  ];

  const sections = [
    { id: 'personal', name: 'Personal Information', icon: '👤' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'experience', name: 'Work Experience', icon: '💼' },
    { id: 'skills', name: 'Skills', icon: '🔧' },
    { id: 'projects', name: 'Projects', icon: '📂' },
    { id: 'certifications', name: 'Certifications', icon: '🏆' },
    { id: 'languages', name: 'Languages', icon: '🌍' },
    { id: 'achievements', name: 'Achievements', icon: '⭐' },
    { id: 'references', name: 'References', icon: '📝' },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profileImage: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAtsScore = () => {
    let score = 0;
    const { personalInfo, education, experience, skills } = formData;

    // Check required fields
    if (personalInfo.name) score += 10;
    if (personalInfo.email) score += 10;
    if (personalInfo.phone) score += 10;
    if (personalInfo.location) score += 10;
    if (personalInfo.summary) score += 10;

    // Check content length
    if (education.length > 0) score += 10;
    if (experience.length > 0) score += 10;
    if (skills.length > 0) score += 10;

    // Check for keywords (simplified version)
    const keywords = ['experience', 'skills', 'education', 'project', 'certification'];
    const content = JSON.stringify(formData).toLowerCase();
    keywords.forEach(keyword => {
      if (content.includes(keyword)) score += 2;
    });

    setAtsScore(Math.min(score, 100));
  };

  const addSection = (sectionType) => {
    const newItem = {
      id: Date.now(),
      ...getDefaultValues(sectionType)
    };

    setFormData(prev => ({
      ...prev,
      [sectionType]: [...prev[sectionType], newItem]
    }));
  };

  const getDefaultValues = (sectionType) => {
    switch (sectionType) {
      case 'education':
        return { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', achievements: '' };
      case 'experience':
        return { company: '', position: '', location: '', startDate: '', endDate: '', description: '', achievements: [] };
      case 'projects':
        return { name: '', description: '', technologies: [], link: '', startDate: '', endDate: '' };
      case 'certifications':
        return { name: '', issuer: '', date: '', expiryDate: '', credentialId: '' };
      case 'languages':
        return { language: '', proficiency: '' };
      case 'achievements':
        return { title: '', description: '', date: '' };
      case 'references':
        return { name: '', position: '', company: '', email: '', phone: '' };
      default:
        return {};
    }
  };

  const removeSection = (sectionType, index) => {
    setFormData(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].filter((_, i) => i !== index)
    }));
  };

  const updateSection = (sectionType, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={calculateAtsScore}
            className="px-4 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-700/80 transition-colors"
          >
            Check ATS Score
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700/80 transition-colors"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>

        {!previewMode ? (
          <div className="grid grid-cols-12 gap-8">
            {/* Template Selection */}
            <div className="col-span-3">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-blue-400/20">
                <h2 className="text-xl font-semibold mb-4 text-white">Templates</h2>
                <div className="space-y-4">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'bg-blue-600/80 border-2 border-blue-400'
                          : 'bg-white/5 hover:bg-white/10 border border-blue-400/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{template.thumbnail}</span>
                        <div>
                          <h3 className="font-medium text-white">{template.name}</h3>
                          <p className="text-sm text-gray-300">{template.category}</p>
                          <p className="text-sm text-green-400">ATS Score: {template.score}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 mt-6 border border-blue-400/20">
                <h2 className="text-xl font-semibold mb-4 text-white">Sections</h2>
                <div className="space-y-2">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-600/80 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span>{section.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-blue-400/20">
                {activeSection === 'personal' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                        {formData.personalInfo.profileImage ? (
                          <img
                            src={formData.personalInfo.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">👤</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Upload Photo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, name: e.target.value }
                          }))}
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
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))}
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
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
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
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={formData.personalInfo.linkedin}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio
                        </label>
                        <input
                          type="url"
                          value={formData.personalInfo.portfolio}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary
                      </label>
                      <textarea
                        value={formData.personalInfo.summary}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, summary: e.target.value }
                        }))}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Education History</h3>
                      <button
                        onClick={() => addSection('education')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Education
                      </button>
                    </div>

                    {formData.education.map((edu, index) => (
                      <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Education #{index + 1}</h4>
                          <button
                            onClick={() => removeSection('education', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              School/University
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => updateSection('education', index, 'school', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateSection('education', index, 'degree', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => updateSection('education', index, 'field', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              GPA
                            </label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => updateSection('education', index, 'gpa', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={edu.startDate}
                              onChange={(e) => updateSection('education', index, 'startDate', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={edu.endDate}
                              onChange={(e) => updateSection('education', index, 'endDate', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Achievements
                          </label>
                          <textarea
                            value={edu.achievements}
                            onChange={(e) => updateSection('education', index, 'achievements', e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Work Experience</h3>
                      <button
                        onClick={() => addSection('experience')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Experience
                      </button>
                    </div>

                    {formData.experience.map((exp, index) => (
                      <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Experience #{index + 1}</h4>
                          <button
                            onClick={() => removeSection('experience', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateSection('experience', index, 'company', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Position
                            </label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateSection('experience', index, 'position', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateSection('experience', index, 'location', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateSection('experience', index, 'startDate', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateSection('experience', index, 'endDate', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateSection('experience', index, 'description', e.target.value)}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Key Achievements
                          </label>
                          <div className="space-y-2">
                            {exp.achievements.map((achievement, aIndex) => (
                              <div key={aIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => {
                                    const newAchievements = [...exp.achievements];
                                    newAchievements[aIndex] = e.target.value;
                                    updateSection('experience', index, 'achievements', newAchievements);
                                  }}
                                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                  onClick={() => {
                                    const newAchievements = exp.achievements.filter((_, i) => i !== aIndex);
                                    updateSection('experience', index, 'achievements', newAchievements);
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newAchievements = [...exp.achievements, ''];
                                updateSection('experience', index, 'achievements', newAchievements);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              + Add Achievement
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Skills
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter a skill"
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const skill = e.target.value.trim();
                              if (skill) {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, { name: skill, level: 'Intermediate' }]
                                }));
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <select
                          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            const skill = e.target.previousSibling.value.trim();
                            if (skill) {
                              setFormData(prev => ({
                                ...prev,
                                skills: [...prev.skills, { name: skill, level: e.target.value }]
                              }));
                              e.target.previousSibling.value = '';
                            }
                          }}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Enter a skill"]');
                            const select = input.nextSibling;
                            const skill = input.value.trim();
                            if (skill) {
                              setFormData(prev => ({
                                ...prev,
                                skills: [...prev.skills, { name: skill, level: select.value }]
                              }));
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{skill.name}</span>
                            <span className="ml-2 text-sm text-gray-500">({skill.level})</span>
                          </div>
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-blue-400/20">
            <div className="aspect-[1/1.414] bg-white rounded-xl p-8 overflow-auto">
              <PDFDownloadLink
                document={<ResumePDF data={formData} template={selectedTemplate} />}
                fileName="resume.pdf"
                className="hidden"
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Generating PDF...' : 'Download PDF'
                }
              </PDFDownloadLink>
              <ResumePDF data={formData} template={selectedTemplate} />
            </div>
          </div>
        )}

        {atsScore > 0 && (
          <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 border border-blue-400/20">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-medium text-white">ATS Score</h3>
                <p className="text-sm text-gray-300">{atsScore}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-6 py-3 bg-gray-600/80 text-white rounded-xl hover:bg-gray-700/80 transition-colors"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={async () => {
              const blob = await pdf(<ResumePDF data={formData} template={selectedTemplate} />).toBlob();
              saveAs(blob, 'resume.pdf');
            }}
            className="px-6 py-3 bg-blue-600/80 text-white rounded-xl hover:bg-blue-700/80 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder; 