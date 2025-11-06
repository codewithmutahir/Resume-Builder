import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ClassicTemplate = ({ data, colors }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  // Use provided colors or fallback to defaults
  const primaryColor = colors?.primary || '#1f2937';
  const secondaryColor = colors?.secondary || '#374151';
  const accentColor = colors?.accent || '#9ca3af';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  return (
    <div style={{ backgroundColor: 'white', color: textColor, minHeight: '100%', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: '24px', paddingTop: '32px', paddingLeft: '32px', paddingRight: '32px', borderBottom: `4px solid ${primaryColor}` }}>
        {personal.picture && (
          <div style={{ marginBottom: '16px' }}>
            <img
              src={personal.picture}
              alt="Profile"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `4px solid ${primaryColor}`,
                margin: '0 auto'
              }}
            />
          </div>
        )}
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        <p style={{ fontSize: '1.25rem', color: textSecondaryColor, marginBottom: '16px', fontStyle: 'italic' }}>{personal.title || 'Professional Title'}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.875rem', color: textSecondaryColor }}>
          {personal.email && <span style={{ marginLeft: '6px', marginRight: '6px' }}>{personal.email}</span>}
          {personal.phone && <span style={{ marginLeft: '6px', marginRight: '6px' }}>• {personal.phone}</span>}
          {personal.location && <span style={{ marginLeft: '6px', marginRight: '6px' }}>• {personal.location}</span>}
          {personal.linkedin && <span style={{ marginLeft: '6px', marginRight: '6px' }}>• {personal.linkedin}</span>}
          {personal.website && <span style={{ marginLeft: '6px', marginRight: '6px' }}>• {personal.website}</span>}
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              Professional Summary
            </h2>
            <p style={{ color: textColor, lineHeight: '1.625', textAlign: 'justify' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              Professional Experience
            </h2>
            <div>
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: index < experience.length - 1 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>{exp.position}</h3>
                      <p style={{ color: textSecondaryColor, fontStyle: 'italic' }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.875rem', color: textSecondaryColor }}>
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.location && <p style={{ fontStyle: 'italic' }}>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div style={{ color: textColor, marginTop: '8px', whiteSpace: 'pre-line', lineHeight: '1.625' }}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              Education
            </h2>
            <div>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: index < education.length - 1 ? '12px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>{edu.degree}</h3>
                      <p style={{ color: textSecondaryColor, fontStyle: 'italic' }}>{edu.school}</p>
                      {edu.field && <p style={{ color: textSecondaryColor }}>{edu.field}</p>}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
                  {edu.description && (
                    <p style={{ color: textColor, fontSize: '0.875rem', marginTop: '4px' }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              Skills & Expertise
            </h2>
            <p style={{ color: textColor, lineHeight: '1.625' }}>
              {skills.join(' • ')}
            </p>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              Notable Projects
            </h2>
            <div>
              {projects.map((project, index) => (
                <div key={index} style={{ marginBottom: index < projects.length - 1 ? '12px' : '0' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>{project.name}</h3>
                  {project.technologies && (
                    <p style={{ fontSize: '0.875rem', color: textSecondaryColor, fontStyle: 'italic' }}>{project.technologies}</p>
                  )}
                  <p style={{ color: textColor, marginTop: '4px' }}>{project.description}</p>
                  {project.link && (
                    <p style={{ fontSize: '0.875rem', color: textSecondaryColor, marginTop: '4px' }}>{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              Certifications
            </h2>
            <div>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: index < certifications.length - 1 ? '8px' : '0' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>{cert.name}</h3>
                  <p style={{ color: textSecondaryColor }}>{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</p>
                  {cert.credentialId && (
                    <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>Credential ID: {cert.credentialId}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Playfair Display, serif', paddingBottom: '8px', borderBottom: `1px solid ${accentColor}`, marginBottom: '12px' }}>
              References
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {references.map((ref, index) => (
                <div key={index}>
                  <h3 style={{ fontWeight: 'bold', color: textColor }}>{ref.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: textSecondaryColor, fontStyle: 'italic' }}>{ref.title}</p>
                  <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>{ref.company}</p>
                  {ref.email && <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>{ref.email}</p>}
                  {ref.phone && <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
