import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottom: '1 solid #000000',
    paddingBottom: 3,
  },
  content: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    backgroundColor: '#f0f0f0',
    padding: '3 8',
    borderRadius: 3,
    fontSize: 9,
  },
});

const ResumePDF = ({ data, template }) => {
  const { personalInfo, education, experience, skills, projects, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.contact}>{personalInfo.email} | {personalInfo.phone}</Text>
          <Text style={styles.contact}>{personalInfo.location}</Text>
          {personalInfo.linkedin && (
            <Text style={styles.contact}>LinkedIn: {personalInfo.linkedin}</Text>
          )}
          {personalInfo.portfolio && (
            <Text style={styles.contact}>Portfolio: {personalInfo.portfolio}</Text>
          )}
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.content}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.label}>{exp.position}</Text>
                  <Text style={styles.value}>{exp.company}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{exp.startDate} - {exp.endDate}</Text>
                  <Text style={styles.value}>{exp.location}</Text>
                </View>
                <Text style={styles.content}>{exp.description}</Text>
                {exp.achievements.length > 0 && (
                  <View style={styles.content}>
                    <Text>Key Achievements:</Text>
                    {exp.achievements.map((achievement, i) => (
                      <Text key={i}>• {achievement}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.label}>{edu.degree}</Text>
                  <Text style={styles.value}>{edu.school}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{edu.startDate} - {edu.endDate}</Text>
                  <Text style={styles.value}>{edu.field}</Text>
                </View>
                {edu.gpa && (
                  <Text style={styles.content}>GPA: {edu.gpa}</Text>
                )}
                {edu.achievements && (
                  <Text style={styles.content}>{edu.achievements}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill.name} ({skill.level})
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.label}>{project.name}</Text>
                  <Text style={styles.value}>{project.startDate} - {project.endDate}</Text>
                </View>
                <Text style={styles.content}>{project.description}</Text>
                {project.technologies.length > 0 && (
                  <Text style={styles.content}>
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
                {project.link && (
                  <Text style={styles.content}>Link: {project.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.label}>{cert.name}</Text>
                  <Text style={styles.value}>{cert.issuer}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{cert.date}</Text>
                  {cert.expiryDate && (
                    <Text style={styles.value}>Expires: {cert.expiryDate}</Text>
                  )}
                </View>
                {cert.credentialId && (
                  <Text style={styles.content}>Credential ID: {cert.credentialId}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF; 