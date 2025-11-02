import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 48,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 32,
  },
  name: {
    fontSize: 36,
    fontWeight: 'light',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: 'light',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    fontSize: 11,
    color: '#4b5563',
  },
  contactItem: {
    marginRight: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },
  subsection: {
    marginBottom: 24,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  subsectionCompany: {
    fontSize: 11,
    color: '#4b5563',
  },
  subsectionDate: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
  },
  text: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    marginTop: 8,
  },
  skillsText: {
    fontSize: 11,
    color: '#374151',
  },
  refGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  refItem: {
    width: '45%',
  },
  refName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  refDetail: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 2,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const MinimalTemplatePDF = ({ data }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName || 'Your Name'}</Text>
          <Text style={styles.title}>{personal?.title || 'Professional Title'}</Text>
          
          <View style={styles.contactInfo}>
            {personal?.email && <Text style={styles.contactItem}>{personal.email}</Text>}
            {personal?.phone && <Text style={styles.contactItem}>{personal.phone}</Text>}
            {personal?.location && <Text style={styles.contactItem}>{personal.location}</Text>}
            {personal?.linkedin && <Text style={styles.contactItem}>{personal.linkedin}</Text>}
            {personal?.website && <Text style={styles.contactItem}>{personal.website}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personal?.summary && (
          <View style={styles.section}>
            <Text style={styles.summaryText}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.subsection}>
                <View style={styles.subsectionHeader}>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.subsectionTitle}>{exp.position}</Text>
                    <Text style={styles.subsectionCompany}>{exp.company}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text style={styles.subsectionDate}>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </Text>
                    {exp.location && <Text style={styles.subsectionDate}>{exp.location}</Text>}
                  </View>
                </View>
                {exp.description && <Text style={styles.text}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <View style={styles.subsectionHeader}>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.subsectionTitle}>{edu.degree}</Text>
                    <Text style={styles.subsectionCompany}>{edu.school}</Text>
                    {edu.field && <Text style={{ fontSize: 10, color: '#6b7280' }}>{edu.field}</Text>}
                  </View>
                  <View>
                    <Text style={styles.subsectionDate}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </View>
                </View>
                {edu.description && <Text style={styles.text}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{skills.join(', ')}</Text>
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <Text style={styles.subsectionTitle}>{project.name}</Text>
                {project.technologies && (
                  <Text style={{ fontSize: 10, color: '#4b5563' }}>{project.technologies}</Text>
                )}
                {project.description && <Text style={styles.text}>{project.description}</Text>}
                {project.link && (
                  <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>{project.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{cert.name}</Text>
                <Text style={{ fontSize: 10, color: '#4b5563' }}>
                  {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                </Text>
                {cert.credentialId && (
                  <Text style={{ fontSize: 9, color: '#6b7280' }}>ID: {cert.credentialId}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.refGrid}>
              {references.map((ref, index) => (
                <View key={index} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetail}>{ref.title}</Text>
                  <Text style={styles.refDetail}>{ref.company}</Text>
                  {ref.email && <Text style={styles.refDetail}>{ref.email}</Text>}
                  {ref.phone && <Text style={styles.refDetail}>{ref.phone}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
