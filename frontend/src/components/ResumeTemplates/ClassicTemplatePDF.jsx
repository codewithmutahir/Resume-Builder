import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ClassicTemplatePDF = ({ data, colors }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  // Use provided colors or fallback to defaults
  const primaryColor = colors?.primary || '#1f2937';
  const secondaryColor = colors?.secondary || '#374151';
  const accentColor = colors?.accent || '#9ca3af';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  // Create styles dynamically with colors
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: 0,
      fontFamily: 'Times-Roman',
    },
    header: {
      textAlign: 'center',
      paddingTop: 32,
      paddingBottom: 24,
      paddingLeft: 32,
      paddingRight: 32,
      borderBottomWidth: 4,
      borderBottomColor: primaryColor,
    },
    profileImage: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 4,
      borderColor: primaryColor,
      marginBottom: 16,
      alignSelf: 'center',
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 16,
      color: textSecondaryColor,
      marginBottom: 16,
      fontStyle: 'italic',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      fontSize: 11,
      color: textSecondaryColor,
    },
    contactItem: {
      marginLeft: 6,
      marginRight: 6,
    },
    content: {
      padding: 32,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: textColor,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: accentColor,
      marginBottom: 12,
    },
    summaryText: {
      fontSize: 11,
      color: textColor,
      lineHeight: 1.6,
      textAlign: 'justify',
    },
    subsection: {
      marginBottom: 16,
    },
    subsectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    subsectionTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 2,
    },
    subsectionCompany: {
      fontSize: 11,
      color: textSecondaryColor,
      fontStyle: 'italic',
    },
    subsectionDate: {
      fontSize: 11,
      color: textSecondaryColor,
      textAlign: 'right',
    },
    subsectionLocation: {
      fontSize: 11,
      color: textSecondaryColor,
      textAlign: 'right',
      fontStyle: 'italic',
    },
    text: {
      fontSize: 11,
      lineHeight: 1.6,
      color: textColor,
      marginTop: 8,
    },
    skillsText: {
      fontSize: 11,
      color: textColor,
      lineHeight: 1.6,
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
      color: textColor,
      marginBottom: 2,
    },
    refTitle: {
      fontSize: 10,
      color: textSecondaryColor,
      fontStyle: 'italic',
      marginBottom: 2,
    },
    refDetail: {
      fontSize: 10,
      color: textSecondaryColor,
      marginBottom: 2,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {personal?.picture && (
            <Image
              src={personal.picture}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.name}>{personal?.fullName || 'Your Name'}</Text>
          <Text style={styles.title}>{personal?.title || 'Professional Title'}</Text>
          
          <View style={styles.contactInfo}>
            {personal?.email && <Text style={styles.contactItem}>{personal.email}</Text>}
            {personal?.phone && <Text style={styles.contactItem}>• {personal.phone}</Text>}
            {personal?.location && <Text style={styles.contactItem}>• {personal.location}</Text>}
            {personal?.linkedin && <Text style={styles.contactItem}>• {personal.linkedin}</Text>}
            {personal?.website && <Text style={styles.contactItem}>• {personal.website}</Text>}
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary */}
          {personal?.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.summaryText}>{personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
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
                      {exp.location && <Text style={styles.subsectionLocation}>{exp.location}</Text>}
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
                <View key={index} style={{ marginBottom: 12 }}>
                  <View style={styles.subsectionHeader}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                      <Text style={styles.subsectionTitle}>{edu.degree}</Text>
                      <Text style={styles.subsectionCompany}>{edu.school}</Text>
                      {edu.field && <Text style={{ fontSize: 11, color: textSecondaryColor }}>{edu.field}</Text>}
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
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <Text style={styles.skillsText}>{skills.join(' • ')}</Text>
            </View>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notable Projects</Text>
              {projects.map((project, index) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  <Text style={styles.subsectionTitle}>{project.name}</Text>
                  {project.technologies && (
                    <Text style={{ fontSize: 10, color: textSecondaryColor, fontStyle: 'italic' }}>{project.technologies}</Text>
                  )}
                  {project.description && <Text style={styles.text}>{project.description}</Text>}
                  {project.link && (
                    <Text style={{ fontSize: 10, color: textSecondaryColor, marginTop: 4 }}>{project.link}</Text>
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
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text style={styles.subsectionTitle}>{cert.name}</Text>
                  <Text style={styles.subsectionCompany}>
                    {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                  </Text>
                  {cert.credentialId && (
                    <Text style={{ fontSize: 10, color: textSecondaryColor }}>Credential ID: {cert.credentialId}</Text>
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
                    <Text style={styles.refTitle}>{ref.title}</Text>
                    <Text style={styles.refDetail}>{ref.company}</Text>
                    {ref.email && <Text style={styles.refDetail}>{ref.email}</Text>}
                    {ref.phone && <Text style={styles.refDetail}>{ref.phone}</Text>}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
