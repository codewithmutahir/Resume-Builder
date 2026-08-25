import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { resolveTypography } from '@/constants/typography';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const MinimalTemplatePDF = ({ data, colors, typography }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  const primaryColor = colors?.primary || '#6b7280';
  const secondaryColor = colors?.secondary || '#4b5563';
  const accentColor = colors?.accent || '#9ca3af';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';
  const fonts = resolveTypography(typography);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 40,
      fontFamily: fonts.body,
    },
    header: {
      marginBottom: 18,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 18,
      marginBottom: 10,
    },
    profileImage: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      borderColor: accentColor,
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontFamily: fonts.heading,
      fontSize: 30,
      fontWeight: 'light',
      marginBottom: 2,
      letterSpacing: -0.5,
    },
    title: {
      fontSize: 12,
      color: secondaryColor,
      fontWeight: 'light',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      fontSize: 10,
      color: secondaryColor,
    },
    contactItem: {
      marginRight: 10,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 9,
      fontWeight: 'bold',
      color: primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 10,
      lineHeight: 1.45,
      color: textSecondaryColor,
    },
    subsection: {
      marginBottom: 10,
    },
    subsectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    subsectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 11,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 1,
    },
    subsectionCompany: {
      fontSize: 10,
      color: secondaryColor,
    },
    subsectionDate: {
      fontSize: 10,
      color: primaryColor,
      textAlign: 'right',
    },
    text: {
      fontSize: 9,
      lineHeight: 1.45,
      color: textSecondaryColor,
      marginTop: 3,
    },
    skillsText: {
      fontSize: 10,
      color: textSecondaryColor,
    },
    refGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    refItem: {
      width: '45%',
    },
    refName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 1,
    },
    refDetail: {
      fontSize: 9,
      color: secondaryColor,
      marginBottom: 1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} wrap={false}>
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
            {personal?.email && <Text style={styles.contactItem}>{personal.email}</Text>}
            {personal?.phone && <Text style={styles.contactItem}>{personal.phone}</Text>}
            {personal?.location && <Text style={styles.contactItem}>{personal.location}</Text>}
            {personal?.linkedin && <Text style={styles.contactItem}>{personal.linkedin}</Text>}
            {personal?.website && <Text style={styles.contactItem}>{personal.website}</Text>}
          </View>
        </View>

        {personal?.summary && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.summaryText}>{personal.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.subsection} wrap={false} minPresenceAhead={28}>
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

        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.subsection} wrap={false} minPresenceAhead={24}>
                <View style={styles.subsectionHeader}>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.subsectionTitle}>{edu.degree}</Text>
                    <Text style={styles.subsectionCompany}>{edu.school}</Text>
                    {edu.field && <Text style={{ fontSize: 9, color: primaryColor }}>{edu.field}</Text>}
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

        {skills && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{skills.join(', ')}</Text>
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.subsection} wrap={false} minPresenceAhead={28}>
                <Text style={styles.subsectionTitle}>{project.name}</Text>
                {project.technologies && (
                  <Text style={{ fontSize: 9, color: secondaryColor }}>{project.technologies}</Text>
                )}
                {project.description && <Text style={styles.text}>{project.description}</Text>}
                {project.link && (
                  <Text style={{ fontSize: 9, color: primaryColor, marginTop: 2 }}>{project.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={{ marginBottom: 6 }} wrap={false} minPresenceAhead={20}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: textColor }}>{cert.name}</Text>
                <Text style={{ fontSize: 9, color: secondaryColor }}>
                  {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                </Text>
                {cert.credentialId && (
                  <Text style={{ fontSize: 8, color: primaryColor }}>ID: {cert.credentialId}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {references && references.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.refGrid}>
              {references.map((ref, index) => (
                <View key={index} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetail}>{ref.title}</Text>
                  <Text style={styles.refDetail}>{ref.company}</Text>
                  {ref.email && <Text style={styles.refDetail}>{ref.email}</Text>}
                  {ref.phone && <Text style={{ fontSize: 9, color: primaryColor }}>{ref.phone}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
