import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';

// Icon components
const MailIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#ffffff" strokeWidth="2" fill="none"/>
    <Path d="M22 6l-10 7L2 6" stroke="#ffffff" strokeWidth="2" fill="none"/>
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#ffffff" strokeWidth="2" fill="none"/>
  </Svg>
);

const LocationIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#ffffff" strokeWidth="2" fill="none"/>
    <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#ffffff" strokeWidth="2" fill="none"/>
  </Svg>
);

const LinkedinIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" stroke="#ffffff" strokeWidth="2" fill="none"/>
    <Path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="#ffffff" strokeWidth="2" fill="none"/>
  </Svg>
);

const GlobeIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="#ffffff" strokeWidth="2" fill="none"/>
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#ffffff" strokeWidth="2" fill="none"/>
  </Svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const CreativeTemplatePDF = ({ data, colors }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  // Use provided colors or fallback to defaults
  const primaryColor = colors?.primary || '#9333ea';
  const secondaryColor = colors?.secondary || '#7c3aed';
  const accentColor = colors?.accent || '#2563eb';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  // Create styles dynamically with colors
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#faf5ff',
      padding: 0,
      fontFamily: 'Helvetica',
      flexDirection: 'column',
    },
    header: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      padding: 20,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 4,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      color: '#e9d5ff',
      marginBottom: 8,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      fontSize: 10,
    },
    contactItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '3 10',
      borderRadius: 100,
      marginRight: 6,
      marginBottom: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    content: {
      padding: 20,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      breakInside: 'avoid',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: primaryColor,
      marginBottom: 10,
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.4,
      color: textSecondaryColor,
    },
    subsection: {
      marginBottom: 12,
      paddingLeft: 16,
      borderLeftWidth: 3,
      borderLeftColor: primaryColor,
      position: 'relative',
      breakInside: 'avoid',
    },
    subsectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    subsectionTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 2,
    },
    subsectionCompany: {
      fontSize: 11,
      color: secondaryColor,
      fontWeight: 'bold',
    },
    subsectionDate: {
      fontSize: 11,
      color: textSecondaryColor,
      textAlign: 'right',
    },
    text: {
      fontSize: 11,
      lineHeight: 1.6,
      color: textSecondaryColor,
      marginTop: 8,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillBadge: {
      backgroundColor: '#f3e8ff',
      color: secondaryColor,
      fontSize: 11,
      fontWeight: 'bold',
      padding: '8 16',
      borderRadius: 100,
      marginRight: 8,
      marginBottom: 8,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 24,
    },
    gridItem: {
      width: '47%',
    },
    projectItem: {
      borderLeftWidth: 4,
      borderLeftColor: primaryColor,
      paddingLeft: 16,
      width: '47%',
      marginBottom: 12,
      breakInside: 'avoid',
    },
    certItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      breakInside: 'avoid',
    },
    certDot: {
      width: 8,
      height: 8,
      backgroundColor: primaryColor,
      borderRadius: 4,
      marginTop: 8,
      marginRight: 12,
    },
    refGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    refItem: {
      width: '45%',
      borderLeftWidth: 4,
      borderLeftColor: accentColor,
      paddingLeft: 16,
      breakInside: 'avoid',
    },
    refName: {
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
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
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {personal?.picture && (
              <Image
                src={personal.picture}
                style={styles.profileImage}
              />
            )}
            <View style={styles.headerText}>
              <Text style={styles.name}>{personal?.fullName || 'Your Name'}</Text>
              <Text style={styles.title}>{personal?.title || 'Professional Title'}</Text>
            </View>
          </View>
          
          <View style={styles.contactInfo}>
            {personal?.email && (
              <View style={styles.contactItem}>
                <MailIcon />
                <Text style={{ fontSize: 11 }}>{personal.email}</Text>
              </View>
            )}
            {personal?.phone && (
              <View style={styles.contactItem}>
                <PhoneIcon />
                <Text style={{ fontSize: 11 }}>{personal.phone}</Text>
              </View>
            )}
            {personal?.location && (
              <View style={styles.contactItem}>
                <LocationIcon />
                <Text style={{ fontSize: 11 }}>{personal.location}</Text>
              </View>
            )}
            {personal?.linkedin && (
              <View style={styles.contactItem}>
                <LinkedinIcon />
                <Text style={{ fontSize: 11 }}>{personal.linkedin}</Text>
              </View>
            )}
            {personal?.website && (
              <View style={styles.contactItem}>
                <GlobeIcon />
                <Text style={{ fontSize: 11 }}>{personal.website}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary */}
          {personal?.summary && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.summaryText}>{personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View style={styles.card}>
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

          {/* Skills & Education Grid */}
          <View style={styles.gridContainer}>
            {/* Skills */}
            {skills && skills.length > 0 && (
              <View style={[styles.card, styles.gridItem]}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {skills.map((skill, index) => (
                    <Text key={index} style={styles.skillBadge}>{skill}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <View style={[styles.card, styles.gridItem]}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, index) => (
                  <View key={index} style={{ marginBottom: 16 }}>
                    <Text style={styles.subsectionTitle}>{edu.degree}</Text>
                    <Text style={styles.subsectionCompany}>{edu.school}</Text>
                    {edu.field && <Text style={{ fontSize: 10, color: textSecondaryColor }}>{edu.field}</Text>}
                    <Text style={{ fontSize: 9, color: textSecondaryColor, marginTop: 4 }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Projects</Text>
              <View style={styles.gridContainer}>
                {projects.map((project, index) => (
                  <View key={index} style={styles.projectItem}>
                    <Text style={styles.subsectionTitle}>{project.name}</Text>
                    {project.technologies && (
                      <Text style={{ fontSize: 10, color: secondaryColor }}>{project.technologies}</Text>
                    )}
                    {project.description && (
                      <Text style={{ fontSize: 10, color: textSecondaryColor, marginTop: 4 }}>{project.description}</Text>
                    )}
                    {project.link && (
                      <Text style={{ fontSize: 10, color: accentColor, marginTop: 4 }}>{project.link}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, index) => (
                <View key={index} style={styles.certItem}>
                  <View style={styles.certDot} />
                  <View>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: textColor }}>{cert.name}</Text>
                    <Text style={{ fontSize: 10, color: secondaryColor }}>
                      {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                    </Text>
                    {cert.credentialId && (
                      <Text style={{ fontSize: 9, color: textSecondaryColor }}>ID: {cert.credentialId}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>References</Text>
              <View style={styles.refGrid}>
                {references.map((ref, index) => (
                  <View key={index} style={styles.refItem}>
                    <Text style={styles.refName}>{ref.name}</Text>
                    <Text style={styles.refDetail}>{ref.title}</Text>
                    <Text style={styles.refDetail}>{ref.company}</Text>
                    {ref.email && <Text style={{ fontSize: 10, color: accentColor }}>{ref.email}</Text>}
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