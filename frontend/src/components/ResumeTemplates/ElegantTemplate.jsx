import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ElegantTemplate = ({ data, colors }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  // Use provided colors or fallback to defaults
  const primaryColor = colors?.primary || '#1f2937';
  const secondaryColor = colors?.secondary || '#374151';
  const accentColor = colors?.accent || '#9ca3af';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  return (
    <div style={{ backgroundColor: 'white', color: textColor, minHeight: '100%', fontFamily: 'Georgia, serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: '100%' }}>
        {/* Sidebar */}
        <div style={{ backgroundColor: primaryColor, color: '#f3f4f6', padding: '32px' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
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
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    margin: '0 auto'
                  }}
                />
              </div>
            )}
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
              {personal.fullName || 'Your Name'}
            </h1>
            <p style={{ color: '#d1d5db', fontSize: '0.875rem', fontStyle: 'italic' }}>{personal.title || 'Professional Title'}</p>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: accentColor, fontFamily: 'Playfair Display, serif' }}>
              Contact
            </h2>
            <div style={{ fontSize: '0.875rem' }}>
              {personal.email && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Mail className="w-4 h-4" style={{ marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-word' }}>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Phone className="w-4 h-4" style={{ marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <MapPin className="w-4 h-4" style={{ marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.linkedin && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Linkedin className="w-4 h-4" style={{ marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-word' }}>{personal.linkedin}</span>
                </div>
              )}
              {personal.website && (
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Globe className="w-4 h-4" style={{ marginTop: '2px', marginRight: '8px', flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-word' }}>{personal.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, fontFamily: 'Playfair Display, serif', marginBottom: '12px' }}>
                Skills
              </h2>
              <div>
                {skills.map((skill, index) => (
                  <div key={index} style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, fontFamily: 'Playfair Display, serif', marginBottom: '12px' }}>
                Certifications
              </h2>
              <div>
                {certifications.map((cert, index) => (
                  <div key={index} style={{ fontSize: '0.875rem', marginBottom: index < certifications.length - 1 ? '12px' : '0' }}>
                    <p style={{ fontWeight: '600', color: '#f3f4f6' }}>{cert.name}</p>
                    <p style={{ color: '#d1d5db', fontSize: '0.75rem' }}>{cert.issuer}</p>
                    {cert.date && <p style={{ color: accentColor, fontSize: '0.75rem' }}>{formatDate(cert.date)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ padding: '32px' }}>
          {/* Summary */}
          {personal.summary && (
            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: textColor, lineHeight: '1.625', fontStyle: 'italic', borderLeft: `4px solid ${primaryColor}`, paddingLeft: '16px' }}>
                {personal.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: textColor, fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                Experience
              </h2>
              <div>
                {experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: index < experience.length - 1 ? '24px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
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
                      <div style={{ color: textColor, marginTop: '8px', whiteSpace: 'pre-line', fontSize: '0.875rem', lineHeight: '1.625' }}>{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: textColor, fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                Education
              </h2>
              <div>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: index < education.length - 1 ? '16px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>{edu.degree}</h3>
                        <p style={{ color: textSecondaryColor, fontStyle: 'italic' }}>{edu.school}</p>
                        {edu.field && <p style={{ color: textSecondaryColor, fontSize: '0.875rem' }}>{edu.field}</p>}
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

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: textColor, fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                Projects
              </h2>
              <div>
                {projects.map((project, index) => (
                  <div key={index} style={{ marginBottom: index < projects.length - 1 ? '16px' : '0' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>{project.name}</h3>
                    {project.technologies && (
                      <p style={{ fontSize: '0.875rem', color: textSecondaryColor, fontStyle: 'italic' }}>{project.technologies}</p>
                    )}
                    <p style={{ color: textColor, marginTop: '4px', fontSize: '0.875rem' }}>{project.description}</p>
                    {project.link && (
                      <p style={{ fontSize: '0.875rem', color: textSecondaryColor, marginTop: '4px' }}>{project.link}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {references.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: textColor, fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
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
    </div>
  );
};
