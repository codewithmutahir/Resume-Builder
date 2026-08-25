import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import {
  softPageBackground,
  headerSubtitleColor,
  skillBadgeColors,
} from '@/utils/colorUtils';
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

export const CreativeTemplatePDF = ({ data, colors, typography }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  const primaryColor = colors?.primary || '#9333ea';
  const secondaryColor = colors?.secondary || '#7c3aed';
  const accentColor = colors?.accent || '#2563eb';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  const pageBackground = softPageBackground(accentColor, primaryColor);
  const subtitleColor = headerSubtitleColor(primaryColor, accentColor);
  const badges = skillBadgeColors(primaryColor, accentColor);
  const fonts = resolveTypography(typography);

  const PAGE_PAD = 28;

  const styles = StyleSheet.create({
    page: {
      backgroundColor: pageBackground,
      paddingTop: PAGE_PAD,
      paddingBottom: PAGE_PAD,
      paddingHorizontal: PAGE_PAD,
      fontFamily: fonts.body,
      flexDirection: 'column',
    },
    header: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      marginTop: -PAGE_PAD,
      marginHorizontal: -PAGE_PAD,
      padding: PAGE_PAD,
      marginBottom: 12,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerText: {
      flex: 1,
    },
    name: {
      fontFamily: fonts.heading,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 3,
      color: '#ffffff',
    },
    title: {
      fontSize: 14,
      color: subtitleColor,
      marginBottom: 6,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 6,
      fontSize: 9,
    },
    contactItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '2 8',
      borderRadius: 100,
      marginRight: 5,
      marginBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 6,
      padding: 12,
      marginBottom: 8,
    },
    sectionTitle: {
      fontFamily: fonts.heading,
      fontSize: 13,
      fontWeight: 'bold',
      color: primaryColor,
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 9,
      lineHeight: 1.4,
      color: textSecondaryColor,
    },
    subsection: {
      marginBottom: 8,
      paddingLeft: 12,
      borderLeftWidth: 3,
      borderLeftColor: primaryColor,
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
      fontWeight: 'bold',
    },
    subsectionDate: {
      fontSize: 9,
      color: textSecondaryColor,
      textAlign: 'right',
    },
    text: {
      fontSize: 9,
      lineHeight: 1.4,
      color: textSecondaryColor,
      marginTop: 3,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillBadge: {
      backgroundColor: badges.background,
      color: badges.color,
      fontSize: 9,
      fontWeight: 'bold',
      padding: '4 10',
      borderRadius: 100,
      marginRight: 5,
      marginBottom: 5,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    gridItem: {
      width: '48%',
    },
    projectItem: {
      borderLeftWidth: 3,
      borderLeftColor: primaryColor,
      paddingLeft: 10,
      width: '48%',
      marginBottom: 8,
    },
    certItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    certDot: {
      width: 6,
      height: 6,
      backgroundColor: primaryColor,
      borderRadius: 3,
      marginTop: 4,
      marginRight: 8,
    },
    refGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    refItem: {
      width: '45%',
      borderLeftWidth: 3,
      borderLeftColor: accentColor,
      paddingLeft: 10,
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
            </View>
          </View>
          
          <View style={styles.contactInfo}>
            {personal?.email && (
              <View style={styles.contactItem}>
                <MailIcon />
                <Text style={{ fontSize: 9 }}>{personal.email}</Text>
              </View>
            )}
            {personal?.phone && (
              <View style={styles.contactItem}>
                <PhoneIcon />
                <Text style={{ fontSize: 9 }}>{personal.phone}</Text>
              </View>
            )}
            {personal?.location && (
              <View style={styles.contactItem}>
                <LocationIcon />
                <Text style={{ fontSize: 9 }}>{personal.location}</Text>
              </View>
            )}
            {personal?.linkedin && (
              <View style={styles.contactItem}>
                <LinkedinIcon />
                <Text style={{ fontSize: 9 }}>{personal.linkedin}</Text>
              </View>
            )}
            {personal?.website && (
              <View style={styles.contactItem}>
                <GlobeIcon />
                <Text style={{ fontSize: 9 }}>{personal.website}</Text>
              </View>
            )}
          </View>
        </View>

        {personal?.summary && (
          <View style={styles.card} wrap={false}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.summaryText}>{personal.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.card}>
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

        <View style={styles.gridContainer}>
          {skills && skills.length > 0 && (
            <View style={[styles.card, styles.gridItem]} wrap={false}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <Text key={index} style={styles.skillBadge}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {education && education.length > 0 && (
            <View style={[styles.card, styles.gridItem]}>
              <Text style={styles.sectionTitle} minPresenceAhead={40}>Education</Text>
              {education.map((edu, index) => (
                <View key={index} style={{ marginBottom: 8 }} wrap={false}>
                  <Text style={styles.subsectionTitle}>{edu.degree}</Text>
                  <Text style={styles.subsectionCompany}>{edu.school}</Text>
                  {edu.field && <Text style={{ fontSize: 9, color: textSecondaryColor }}>{edu.field}</Text>}
                  <Text style={{ fontSize: 8, color: textSecondaryColor, marginTop: 2 }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {projects && projects.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Projects</Text>
            <View style={styles.gridContainer}>
              {projects.map((project, index) => (
                <View key={index} style={styles.projectItem} wrap={false} minPresenceAhead={28}>
                  <Text style={styles.subsectionTitle}>{project.name}</Text>
                  {project.technologies && (
                    <Text style={{ fontSize: 9, color: secondaryColor }}>{project.technologies}</Text>
                  )}
                  {project.description && (
                    <Text style={{ fontSize: 9, color: textSecondaryColor, marginTop: 2 }}>{project.description}</Text>
                  )}
                  {project.link && (
                    <Text style={{ fontSize: 9, color: accentColor, marginTop: 2 }}>{project.link}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.certItem} wrap={false} minPresenceAhead={20}>
                <View style={styles.certDot} />
                <View>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: textColor }}>{cert.name}</Text>
                  <Text style={{ fontSize: 9, color: secondaryColor }}>
                    {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                  </Text>
                  {cert.credentialId && (
                    <Text style={{ fontSize: 8, color: textSecondaryColor }}>ID: {cert.credentialId}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {references && references.length > 0 && (
          <View style={styles.card} wrap={false}>
            <Text style={styles.sectionTitle}>References</Text>
            <View style={styles.refGrid}>
              {references.map((ref, index) => (
                <View key={index} style={styles.refItem}>
                  <Text style={styles.refName}>{ref.name}</Text>
                  <Text style={styles.refDetail}>{ref.title}</Text>
                  <Text style={styles.refDetail}>{ref.company}</Text>
                  {ref.email && <Text style={{ fontSize: 9, color: accentColor }}>{ref.email}</Text>}
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
