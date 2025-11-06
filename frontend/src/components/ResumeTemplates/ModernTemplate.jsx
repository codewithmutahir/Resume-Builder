import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ModernTemplate = ({ data, colors }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  // Use provided colors or fallback to defaults
  const primaryColor = colors?.primary || '#2563eb';
  const secondaryColor = colors?.secondary || '#1e40af';
  const accentColor = colors?.accent || '#dbeafe';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  return (
    <div className="bg-white text-gray-900 min-h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: primaryColor, color: 'white', padding: '32px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '8px' }}>{personal.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: '1.25rem', color: accentColor, marginBottom: '16px' }}>{personal.title || 'Professional Title'}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '16px', fontSize: '0.875rem' }}>
          {personal.email && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', marginBottom: '4px' }}>
              <Mail className="w-4 h-4" style={{ marginRight: '4px' }} />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', marginBottom: '4px' }}>
              <Phone className="w-4 h-4" style={{ marginRight: '4px' }} />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', marginBottom: '4px' }}>
              <MapPin className="w-4 h-4" style={{ marginRight: '4px' }} />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', marginBottom: '4px' }}>
              <Linkedin className="w-4 h-4" style={{ marginRight: '4px' }} />
              <span>{personal.linkedin}</span>
            </div>
          )}
          {personal.website && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', marginBottom: '4px' }}>
              <Globe className="w-4 h-4" style={{ marginRight: '4px' }} />
              <span>{personal.website}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              Professional Summary
            </h2>
            <p style={{ color: textSecondaryColor, lineHeight: '1.625' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              Work Experience
            </h2>
            <div>
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: index < experience.length - 1 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: textColor }}>{exp.position}</h3>
                      <p style={{ color: secondaryColor, fontWeight: '500' }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.875rem', color: textSecondaryColor }}>
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div style={{ color: textSecondaryColor, marginTop: '8px', whiteSpace: 'pre-line' }}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              Education
            </h2>
            <div>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: index < education.length - 1 ? '12px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: textColor }}>{edu.degree}</h3>
                      <p style={{ color: secondaryColor, fontWeight: '500' }}>{edu.school}</p>
                      {edu.field && <p style={{ color: textSecondaryColor, fontSize: '0.875rem' }}>{edu.field}</p>}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
                  {edu.description && (
                    <p style={{ color: textSecondaryColor, fontSize: '0.875rem', marginTop: '4px' }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  style={{ 
                    backgroundColor: accentColor,
                    color: secondaryColor,
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '9999px', 
                    display: 'inline-block',
                    padding: '6px 16px',
                    lineHeight: '1',
                    marginRight: '8px',
                    marginBottom: '8px'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              Projects
            </h2>
            <div>
              {projects.map((project, index) => (
                <div key={index} style={{ marginBottom: index < projects.length - 1 ? '12px' : '0' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: textColor }}>{project.name}</h3>
                  {project.technologies && (
                    <p style={{ fontSize: '0.875rem', color: secondaryColor }}>{project.technologies}</p>
                  )}
                  <p style={{ color: textSecondaryColor, marginTop: '4px' }}>{project.description}</p>
                  {project.link && (
                    <p style={{ fontSize: '0.875rem', color: primaryColor, marginTop: '4px' }}>{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              Certifications
            </h2>
            <div>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: index < certifications.length - 1 ? '8px' : '0' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: textColor }}>{cert.name}</h3>
                  <p style={{ color: secondaryColor }}>{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</p>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: secondaryColor, paddingBottom: '8px', borderBottom: `2px solid ${primaryColor}`, marginBottom: '12px' }}>
              References
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {references.map((ref, index) => (
                <div key={index}>
                  <h3 style={{ fontWeight: '600', color: textColor }}>{ref.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>{ref.title}</p>
                  <p style={{ fontSize: '0.875rem', color: textSecondaryColor }}>{ref.company}</p>
                  {ref.email && <p style={{ fontSize: '0.875rem', color: primaryColor }}>{ref.email}</p>}
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
