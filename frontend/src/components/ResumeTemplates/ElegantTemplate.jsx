import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const ElegantTemplate = ({ data }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;

  return (
    <div style={{ backgroundColor: 'white', color: '#111827', minHeight: '100%', fontFamily: 'Georgia, serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: '100%' }}>
        {/* Sidebar */}
        <div style={{ backgroundColor: '#1f2937', color: '#f3f4f6', padding: '32px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
              {personal.fullName || 'Your Name'}
            </h1>
            <p style={{ color: '#d1d5db', fontSize: '0.875rem', fontStyle: 'italic' }}>{personal.title || 'Professional Title'}</p>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: '#9ca3af', fontFamily: 'Playfair Display, serif' }}>
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
              <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontFamily: 'Playfair Display, serif', marginBottom: '12px' }}>
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
              <h2 style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontFamily: 'Playfair Display, serif', marginBottom: '12px' }}>
                Certifications
              </h2>
              <div>
                {certifications.map((cert, index) => (
                  <div key={index} style={{ fontSize: '0.875rem', marginBottom: index < certifications.length - 1 ? '12px' : '0' }}>
                    <p style={{ fontWeight: '600', color: '#f3f4f6' }}>{cert.name}</p>
                    <p style={{ color: '#d1d5db', fontSize: '0.75rem' }}>{cert.issuer}</p>
                    {cert.date && <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{formatDate(cert.date)}</p>}
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
              <p style={{ color: '#1f2937', lineHeight: '1.625', fontStyle: 'italic', borderLeft: '4px solid #1f2937', paddingLeft: '16px' }}>
                {personal.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                Experience
              </h2>
              <div>
                {experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: index < experience.length - 1 ? '24px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{exp.position}</h3>
                        <p style={{ color: '#374151', fontStyle: 'italic' }}>{exp.company}</p>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#4b5563' }}>
                        <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                        {exp.location && <p style={{ fontStyle: 'italic' }}>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <div style={{ color: '#1f2937', marginTop: '8px', whiteSpace: 'pre-line', fontSize: '0.875rem', lineHeight: '1.625' }}>{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                Education
              </h2>
              <div>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: index < education.length - 1 ? '16px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{edu.degree}</h3>
                        <p style={{ color: '#374151', fontStyle: 'italic' }}>{edu.school}</p>
                        {edu.field && <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{edu.field}</p>}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.description && (
                      <p style={{ color: '#1f2937', fontSize: '0.875rem', marginTop: '4px' }}>{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                Projects
              </h2>
              <div>
                {projects.map((project, index) => (
                  <div key={index} style={{ marginBottom: index < projects.length - 1 ? '16px' : '0' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{project.name}</h3>
                    {project.technologies && (
                      <p style={{ fontSize: '0.875rem', color: '#374151', fontStyle: 'italic' }}>{project.technologies}</p>
                    )}
                    <p style={{ color: '#1f2937', marginTop: '4px', fontSize: '0.875rem' }}>{project.description}</p>
                    {project.link && (
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '4px' }}>{project.link}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {references.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                References
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {references.map((ref, index) => (
                  <div key={index}>
                    <h3 style={{ fontWeight: 'bold', color: '#111827' }}>{ref.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#374151', fontStyle: 'italic' }}>{ref.title}</p>
                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>{ref.company}</p>
                    {ref.email && <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{ref.email}</p>}
                    {ref.phone && <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{ref.phone}</p>}
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
