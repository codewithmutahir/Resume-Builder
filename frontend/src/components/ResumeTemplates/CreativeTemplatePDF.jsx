import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#faf5ff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#9333ea',
    color: '#ffffff',
    padding: 32,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    color: '#e9d5ff',
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    fontSize: 11,
  },
  contactItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4 12',
    borderRadius: 100,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  cardNoBreak: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333ea',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
  },
  subsection: {
    marginBottom: 24,
    paddingLeft: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#9333ea',
    position: 'relative',
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
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  subsectionDate: {
    fontSize: 11,
    color: '#4b5563',
    textAlign: 'right',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    marginTop: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
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
    borderLeftColor: '#9333ea',
    paddingLeft: 16,
    width: '47%',
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  certDot: {
    width: 8,
    height: 8,
    backgroundColor: '#9333ea',
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
    borderLeftColor: '#2563eb',
    paddingLeft: 16,
  },
  refName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  refDetail: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 2,
  },
});

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

export const CreativeTemplatePDF = ({ data }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName || 'Your Name'}</Text>
          <Text style={styles.title}>{personal?.title || 'Professional Title'}</Text>
          
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
            <View style={styles.card} wrap={false}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.summaryText}>{personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View style={styles.card} wrap={false}>
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
          <View style={styles.gridContainer} wrap={false}>
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
                    {edu.field && <Text style={{ fontSize: 10, color: '#4b5563' }}>{edu.field}</Text>}
                    <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 4 }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={styles.card} wrap={false}>
              <Text style={styles.sectionTitle}>Projects</Text>
              <View style={styles.gridContainer}>
                {projects.map((project, index) => (
                  <View key={index} style={styles.projectItem}>
                    <Text style={styles.subsectionTitle}>{project.name}</Text>
                    {project.technologies && (
                      <Text style={{ fontSize: 10, color: '#7c3aed' }}>{project.technologies}</Text>
                    )}
                    {project.description && (
                      <Text style={{ fontSize: 10, color: '#374151', marginTop: 4 }}>{project.description}</Text>
                    )}
                    {project.link && (
                      <Text style={{ fontSize: 10, color: '#2563eb', marginTop: 4 }}>{project.link}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <View style={styles.card} wrap={false}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, index) => (
                <View key={index} style={styles.certItem}>
                  <View style={styles.certDot} />
                  <View>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{cert.name}</Text>
                    <Text style={{ fontSize: 10, color: '#7c3aed' }}>
                      {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                    </Text>
                    {cert.credentialId && (
                      <Text style={{ fontSize: 9, color: '#4b5563' }}>ID: {cert.credentialId}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <View style={styles.card} wrap={false}>
              <Text style={styles.sectionTitle}>References</Text>
              <View style={styles.refGrid}>
                {references.map((ref, index) => (
                  <View key={index} style={styles.refItem}>
                    <Text style={styles.refName}>{ref.name}</Text>
                    <Text style={styles.refDetail}>{ref.title}</Text>
                    <Text style={styles.refDetail}>{ref.company}</Text>
                    {ref.email && <Text style={{ fontSize: 10, color: '#2563eb' }}>{ref.email}</Text>}
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
