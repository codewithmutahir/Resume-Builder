import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { resolveTypography } from '@/constants/typography';

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

export const ElegantTemplatePDF = ({ data, colors, typography }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  const primaryColor = colors?.primary || '#1f2937';
  const secondaryColor = colors?.secondary || '#374151';
  const accentColor = colors?.accent || '#9ca3af';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';
  const fonts = resolveTypography(typography);

  // Page Y-padding applies on every page (including wrapped pages).
  // Sidebar uses negative margins so it stays full-bleed edge-to-edge.
  const PAGE_PAD_Y = 36;
  const COL_PAD = 28;

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      flexDirection: 'row',
      paddingTop: PAGE_PAD_Y,
      paddingBottom: PAGE_PAD_Y,
      fontFamily: fonts.body,
    },
    sidebarBg: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '35%',
      backgroundColor: primaryColor,
    },
    sidebar: {
      width: '35%',
      color: '#f3f4f6',
      marginTop: -PAGE_PAD_Y,
      marginBottom: -PAGE_PAD_Y,
      paddingTop: PAGE_PAD_Y,
      paddingBottom: PAGE_PAD_Y,
      paddingHorizontal: COL_PAD,
    },
    mainContent: {
      width: '65%',
      paddingHorizontal: COL_PAD,
    },
    sidebarName: {
      fontFamily: fonts.heading,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    sidebarHeader: {
      marginBottom: 20,
      alignItems: 'center',
    },
    profileImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      marginBottom: 12,
    },
    sidebarTitle: {
      fontSize: 10,
      color: '#d1d5db',
      fontStyle: 'italic',
      marginBottom: 18,
    },
    sidebarSection: {
      marginBottom: 16,
    },
    sidebarSectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
      color: accentColor,
    },
    sidebarText: {
      fontSize: 10,
      flex: 1,
    },
    sidebarSkill: {
      fontSize: 10,
      marginBottom: 5,
    },
    sidebarCertName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#f3f4f6',
      marginBottom: 1,
    },
    sidebarCertIssuer: {
      fontSize: 8,
      color: '#d1d5db',
      marginBottom: 1,
    },
    sidebarCertDate: {
      fontSize: 8,
      color: accentColor,
      marginBottom: 8,
    },
    summary: {
      fontSize: 10,
      color: textColor,
      lineHeight: 1.45,
      fontStyle: 'italic',
      borderLeftWidth: 3,
      borderLeftColor: primaryColor,
      paddingLeft: 12,
      marginBottom: 14,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 14,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 8,
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
    refGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    refItem: {
      width: '45%',
      marginBottom: 8,
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
        {/* Full-bleed sidebar color on every page (including continuation pages) */}
        <View style={styles.sidebarBg} fixed />

        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader} wrap={false}>
            {personal?.picture && (
              <Image
                src={personal.picture}
                style={styles.profileImage}
              />
            )}
            <Text style={styles.sidebarName}>{personal?.fullName || 'Your Name'}</Text>
            <Text style={styles.sidebarTitle}>{personal?.title || 'Professional Title'}</Text>
          </View>

          <View style={styles.sidebarSection} wrap={false}>
            <Text style={styles.sidebarSectionTitle}>CONTACT</Text>
            {personal?.email && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                <MailIcon />
                <Text style={styles.sidebarText}>{personal.email}</Text>
              </View>
            )}
            {personal?.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                <PhoneIcon />
                <Text style={styles.sidebarText}>{personal.phone}</Text>
              </View>
            )}
            {personal?.location && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                <LocationIcon />
                <Text style={styles.sidebarText}>{personal.location}</Text>
              </View>
            )}
            {personal?.linkedin && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                <LinkedinIcon />
                <Text style={styles.sidebarText}>{personal.linkedin}</Text>
              </View>
            )}
            {personal?.website && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                <GlobeIcon />
                <Text style={styles.sidebarText}>{personal.website}</Text>
              </View>
            )}
          </View>

          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection} wrap={false}>
              <Text style={styles.sidebarSectionTitle}>SKILLS</Text>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.sidebarSkill}>{skill}</Text>
              ))}
            </View>
          )}

          {certifications && certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle} minPresenceAhead={40}>CERTIFICATIONS</Text>
              {certifications.map((cert, index) => (
                <View key={index} style={{ marginBottom: 8 }} wrap={false}>
                  <Text style={styles.sidebarCertName}>{cert.name}</Text>
                  <Text style={styles.sidebarCertIssuer}>{cert.issuer}</Text>
                  {cert.date && <Text style={styles.sidebarCertDate}>{formatDate(cert.date)}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.mainContent}>
          {personal?.summary && (
            <Text style={styles.summary} wrap={false}>{personal.summary}</Text>
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

          {projects && projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} minPresenceAhead={40}>Projects</Text>
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

          {references && references.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} minPresenceAhead={40}>References</Text>
              <View style={styles.refGrid}>
                {references.map((ref, index) => (
                  <View key={index} style={styles.refItem} wrap={false} minPresenceAhead={24}>
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
