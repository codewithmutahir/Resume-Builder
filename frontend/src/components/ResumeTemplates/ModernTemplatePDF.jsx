import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { resolveTypography } from '@/constants/typography';

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

export const ModernTemplatePDF = ({ data, colors, typography }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;

  const primaryColor = colors?.primary || '#2563eb';
  const secondaryColor = colors?.secondary || '#1e40af';
  const accentColor = colors?.accent || '#dbeafe';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';
  const fonts = resolveTypography(typography);

  const PAGE_PAD = 40;

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      paddingTop: PAGE_PAD,
      paddingBottom: PAGE_PAD,
      paddingHorizontal: PAGE_PAD,
      fontFamily: fonts.body,
    },
    header: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      marginTop: -PAGE_PAD,
      marginHorizontal: -PAGE_PAD,
      padding: PAGE_PAD,
      marginBottom: 14,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 20,
    },
    profileImage: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontFamily: fonts.heading,
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: accentColor,
      marginBottom: 10,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      fontSize: 10,
    },
    contactItem: {
      fontSize: 10,
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 14,
      fontWeight: 'bold',
      color: secondaryColor,
      paddingBottom: 4,
      borderBottomWidth: 2,
      borderBottomColor: primaryColor,
      marginBottom: 6,
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
      color: secondaryColor,
      fontWeight: 'bold',
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
    },
    text: {
      fontSize: 10,
      lineHeight: 1.45,
      color: textSecondaryColor,
      marginTop: 3,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 2,
    },
    skillBadge: {
      backgroundColor: accentColor,
      color: secondaryColor,
      fontSize: 9,
      fontWeight: 'bold',
      padding: '4 10',
      borderRadius: 100,
      marginRight: 6,
      marginBottom: 6,
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
      color: textSecondaryColor,
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

              <View style={styles.contactInfo}>
                {personal?.email && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 3 }}>
                    <MailIcon />
                    <Text style={styles.contactItem}>{personal.email}</Text>
                  </View>
                )}
                {personal?.phone && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 3 }}>
                    <PhoneIcon />
                    <Text style={styles.contactItem}>{personal.phone}</Text>
                  </View>
                )}
                {personal?.location && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 3 }}>
                    <LocationIcon />
                    <Text style={styles.contactItem}>{personal.location}</Text>
                  </View>
                )}
                {personal?.linkedin && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 3 }}>
                    <LinkedinIcon />
                    <Text style={styles.contactItem}>{personal.linkedin}</Text>
                  </View>
                )}
                {personal?.website && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 3 }}>
                    <GlobeIcon />
                    <Text style={styles.contactItem}>{personal.website}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {personal?.summary && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{personal.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Work Experience</Text>
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
                    {edu.field && <Text style={{ fontSize: 9, color: textSecondaryColor }}>{edu.field}</Text>}
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
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skillBadge}>{skill}</Text>
              ))}
            </View>
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
              <View key={index} style={styles.subsection} wrap={false} minPresenceAhead={20}>
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
                  <Text style={styles.refDetail}>{ref.title}</Text>
                  <Text style={styles.refDetail}>{ref.company}</Text>
                  {ref.email && <Text style={{ fontSize: 9, color: primaryColor }}>{ref.email}</Text>}
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
