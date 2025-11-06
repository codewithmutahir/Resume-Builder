import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path } from '@react-pdf/renderer';

// Icon components
const MailIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
    <Path d="M22 6l-10 7L2 6" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
  </Svg>
);

const LocationIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
    <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
  </Svg>
);

const LinkedinIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
    <Path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
  </Svg>
);

const GlobeIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
    <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#f3f4f6" strokeWidth="2" fill="none"/>
  </Svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ElegantTemplatePDF = ({ data, colors }) => {
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
      flexDirection: 'row',
      fontFamily: 'Times-Roman',
    },
    sidebar: {
      width: '35%',
      backgroundColor: primaryColor,
      color: '#f3f4f6',
      padding: 32,
    },
    mainContent: {
      width: '65%',
      padding: 32,
    },
    sidebarName: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    sidebarTitle: {
      fontSize: 11,
      color: '#d1d5db',
      fontStyle: 'italic',
      marginBottom: 32,
    },
    sidebarSection: {
      marginBottom: 32,
    },
    sidebarSectionTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
      color: accentColor,
    },
    sidebarText: {
      fontSize: 11,
      flex: 1,
    },
    sidebarSkill: {
      fontSize: 11,
      marginBottom: 8,
    },
    sidebarCertName: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#f3f4f6',
      marginBottom: 2,
    },
    sidebarCertIssuer: {
      fontSize: 9,
      color: '#d1d5db',
      marginBottom: 2,
    },
    sidebarCertDate: {
      fontSize: 9,
      color: accentColor,
      marginBottom: 12,
    },
    summary: {
      fontSize: 11,
      color: textColor,
      lineHeight: 1.6,
      fontStyle: 'italic',
      borderLeftWidth: 4,
      borderLeftColor: primaryColor,
      paddingLeft: 16,
      marginBottom: 32,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 16,
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.sidebarName}>{personal?.fullName || 'Your Name'}</Text>
            <Text style={styles.sidebarTitle}>{personal?.title || 'Professional Title'}</Text>
          </View>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>CONTACT</Text>
            {personal?.email && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <MailIcon />
                <Text style={styles.sidebarText}>{personal.email}</Text>
              </View>
            )}
            {personal?.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <PhoneIcon />
                <Text style={styles.sidebarText}>{personal.phone}</Text>
              </View>
            )}
            {personal?.location && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <LocationIcon />
                <Text style={styles.sidebarText}>{personal.location}</Text>
              </View>
            )}
            {personal?.linkedin && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <LinkedinIcon />
                <Text style={styles.sidebarText}>{personal.linkedin}</Text>
              </View>
            )}
            {personal?.website && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <GlobeIcon />
                <Text style={styles.sidebarText}>{personal.website}</Text>
              </View>
            )}
          </View>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>SKILLS</Text>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.sidebarSkill}>{skill}</Text>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>CERTIFICATIONS</Text>
              {certifications.map((cert, index) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  <Text style={styles.sidebarCertName}>{cert.name}</Text>
                  <Text style={styles.sidebarCertIssuer}>{cert.issuer}</Text>
                  {cert.date && <Text style={styles.sidebarCertDate}>{formatDate(cert.date)}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {personal?.summary && (
            <Text style={styles.summary}>{personal.summary}</Text>
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
                <View key={index} style={{ marginBottom: 16 }}>
                  <View style={styles.subsectionHeader}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                      <Text style={styles.subsectionTitle}>{edu.degree}</Text>
                      <Text style={styles.subsectionCompany}>{edu.school}</Text>
                      {edu.field && <Text style={{ fontSize: 10, color: textSecondaryColor }}>{edu.field}</Text>}
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((project, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
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
