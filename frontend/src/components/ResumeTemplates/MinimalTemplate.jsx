import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const MinimalTemplate = ({ data }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;

  return (
    <div style={{ backgroundColor: 'white', color: '#111827', minHeight: '100%', padding: '48px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '300', marginBottom: '4px', letterSpacing: '-0.025em' }}>{personal.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: '1.125rem', color: '#4b5563', fontWeight: '300' }}>{personal.title || 'Professional Title'}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '16px', fontSize: '0.875rem', color: '#4b5563' }}>
          {personal.email && <span style={{ marginRight: '12px' }}>{personal.email}</span>}
          {personal.phone && <span style={{ marginRight: '12px' }}>{personal.phone}</span>}
          {personal.location && <span style={{ marginRight: '12px' }}>{personal.location}</span>}
          {personal.linkedin && <span style={{ marginRight: '12px' }}>{personal.linkedin}</span>}
          {personal.website && <span style={{ marginRight: '12px' }}>{personal.website}</span>}
        </div>
      </div>

      <div>
        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ color: '#374151', lineHeight: '1.625' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Experience
            </h2>
            <div>
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: index < experience.length - 1 ? '24px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{exp.position}</h3>
                      <p style={{ color: '#4b5563' }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div style={{ color: '#374151', fontSize: '0.875rem', marginTop: '8px', whiteSpace: 'pre-line', lineHeight: '1.625' }}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Education
            </h2>
            <div>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: index < education.length - 1 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{edu.degree}</h3>
                      <p style={{ color: '#4b5563' }}>{edu.school}</p>
                      {edu.field && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{edu.field}</p>}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
                  {edu.description && (
                    <p style={{ color: '#374151', fontSize: '0.875rem', marginTop: '4px' }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Skills
            </h2>
            <p style={{ color: '#374151' }}>
              {skills.join(', ')}
            </p>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Projects
            </h2>
            <div>
              {projects.map((project, index) => (
                <div key={index} style={{ marginBottom: index < projects.length - 1 ? '16px' : '0' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827' }}>{project.name}</h3>
                  {project.technologies && (
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{project.technologies}</p>
                  )}
                  <p style={{ color: '#374151', marginTop: '4px', fontSize: '0.875rem' }}>{project.description}</p>
                  {project.link && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Certifications
            </h2>
            <div>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: index < certifications.length - 1 ? '12px' : '0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>{cert.name}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</p>
                  {cert.credentialId && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {cert.credentialId}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div>
            <h2 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              References
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {references.map((ref, index) => (
                <div key={index}>
                  <h3 style={{ fontWeight: '500', color: '#111827' }}>{ref.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{ref.title}</p>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{ref.company}</p>
                  {ref.email && <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{ref.email}</p>}
                  {ref.phone && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
