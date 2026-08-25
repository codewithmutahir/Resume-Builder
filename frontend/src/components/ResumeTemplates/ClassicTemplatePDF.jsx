import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { resolveTypography } from '@/constants/typography';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ClassicTemplatePDF = ({ data, colors, typography }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  const primaryColor = colors?.primary || '#1f2937';
  const secondaryColor = colors?.secondary || '#374151';
  const accentColor = colors?.accent || '#9ca3af';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';
  const fonts = resolveTypography(typography);

  // Page padding applies on EVERY page (including wrapped/continuation pages).
  // Header uses negative margins to stay full-bleed on page 1.
  const PAGE_PAD = 42;

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      paddingTop: PAGE_PAD,
      paddingBottom: PAGE_PAD,
      paddingHorizontal: PAGE_PAD,
      fontFamily: fonts.body,
    },
    header: {
      textAlign: 'center',
      marginTop: -PAGE_PAD,
      marginHorizontal: -PAGE_PAD,
      paddingTop: PAGE_PAD,
      paddingBottom: 18,
      paddingHorizontal: PAGE_PAD,
      borderBottomWidth: 4,
      borderBottomColor: primaryColor,
      marginBottom: 14,
    },
    profileImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 3,
      borderColor: primaryColor,
      marginBottom: 12,
      alignSelf: 'center',
    },
    name: {
      fontFamily: fonts.heading,
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 14,
      color: textSecondaryColor,
      marginBottom: 10,
      fontStyle: 'italic',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      fontSize: 10,
      color: textSecondaryColor,
    },
    contactItem: {
      marginLeft: 5,
      marginRight: 5,
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 12,
      fontWeight: 'bold',
      color: textColor,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: accentColor,
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 10,
      color: textColor,
      lineHeight: 1.45,
      textAlign: 'justify',
    },
    subsection: {
      marginBottom: 8,
    },
    subsectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
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
      color: textSecondaryColor,
      fontStyle: 'italic',
    },
    subsectionDate: {
      fontSize: 10,
      color: textSecondaryColor,
      textAlign: 'right',
    },
    subsectionLocation: {
      fontSize: 10,
      color: textSecondaryColor,
      textAlign: 'right',
      fontStyle: 'italic',
    },
    text: {
      fontSize: 10,
      lineHeight: 1.45,
      color: textColor,
      marginTop: 3,
    },
    skillsText: {
      fontSize: 10,
      color: textColor,
      lineHeight: 1.45,
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
    refTitle: {
      fontSize: 9,
      color: textSecondaryColor,
      fontStyle: 'italic',
      marginBottom: 1,
    },
    refDetail: {
      fontSize: 9,
      color: textSecondaryColor,
      marginBottom: 1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} wrap={false}>
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

        {personal?.summary && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{personal.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Professional Experience</Text>
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
                    {exp.location && <Text style={styles.subsectionLocation}>{exp.location}</Text>}
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

        {skills && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <Text style={styles.skillsText}>{skills.join(' • ')}</Text>
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Notable Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.subsection} wrap={false} minPresenceAhead={28}>
                <Text style={styles.subsectionTitle}>{project.name}</Text>
                {project.technologies && (
                  <Text style={{ fontSize: 9, color: textSecondaryColor, fontStyle: 'italic' }}>{project.technologies}</Text>
                )}
                {project.description && <Text style={styles.text}>{project.description}</Text>}
                {project.link && (
                  <Text style={{ fontSize: 9, color: textSecondaryColor, marginTop: 2 }}>{project.link}</Text>
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
                <Text style={styles.subsectionTitle}>{cert.name}</Text>
                <Text style={styles.subsectionCompany}>
                  {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                </Text>
                {cert.credentialId && (
                  <Text style={{ fontSize: 9, color: textSecondaryColor }}>Credential ID: {cert.credentialId}</Text>
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
                  <Text style={styles.refTitle}>{ref.title}</Text>
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
