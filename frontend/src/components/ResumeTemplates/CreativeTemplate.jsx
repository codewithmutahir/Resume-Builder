import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const CreativeTemplate = ({ data, colors }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;
  
  // Use provided colors or fallback to defaults
  const primaryColor = colors?.primary || '#9333ea';
  const secondaryColor = colors?.secondary || '#7c3aed';
  const accentColor = colors?.accent || '#2563eb';
  const textColor = colors?.text || '#111827';
  const textSecondaryColor = colors?.textSecondary || '#374151';

  return (
    <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)', color: textColor, minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: primaryColor, color: 'white', padding: '24px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            {personal.picture && (
              <img
                src={personal.picture}
                alt="Profile"
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  flexShrink: 0
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '6px' }}>{personal.fullName || 'Your Name'}</h1>
              <p style={{ fontSize: '1.25rem', color: '#e9d5ff', marginBottom: '12px' }}>{personal.title || 'Professional Title'}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '12px', fontSize: '0.875rem' }}>
            {personal.email && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '9999px', marginRight: '8px', marginBottom: '8px' }}>
                <Mail className="w-4 h-4" style={{ marginRight: '4px' }} />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '9999px', marginRight: '8px', marginBottom: '8px' }}>
                <Phone className="w-4 h-4" style={{ marginRight: '4px' }} />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '9999px', marginRight: '8px', marginBottom: '8px' }}>
                <MapPin className="w-4 h-4" style={{ marginRight: '4px' }} />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '9999px', marginRight: '8px', marginBottom: '8px' }}>
                <Linkedin className="w-4 h-4" style={{ marginRight: '4px' }} />
                <span>{personal.linkedin}</span>
              </div>
            )}
            {personal.website && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '9999px', marginRight: '8px', marginBottom: '8px' }}>
                <Globe className="w-4 h-4" style={{ marginRight: '4px' }} />
                <span>{personal.website}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', marginRight: '-128px', marginTop: '-128px' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '192px', height: '192px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', marginLeft: '-96px', marginBottom: '-96px' }}></div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* Summary */}
        {personal.summary && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '18px' }}>
            <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '10px' }}></div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '10px' }}>
              About Me
            </h2>
            <p style={{ color: textSecondaryColor, lineHeight: '1.5', fontSize: '0.9rem' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '18px' }}>
            <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '12px' }}></div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '12px' }}>
              Experience
            </h2>
            <div>
              {experience.map((exp, index) => (
                <div key={index} style={{ position: 'relative', paddingLeft: '20px', borderLeft: `4px solid ${primaryColor}`, marginBottom: index < experience.length - 1 ? '16px' : '0' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '10px', height: '10px', backgroundColor: primaryColor, borderRadius: '9999px', marginLeft: '-7px', marginTop: '4px' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: textColor }}>{exp.position}</h3>
                      <p style={{ color: secondaryColor, fontWeight: '500', fontSize: '0.875rem' }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: textSecondaryColor }}>
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div style={{ color: textSecondaryColor, marginTop: '6px', whiteSpace: 'pre-line', fontSize: '0.875rem', lineHeight: '1.5' }}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Education Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: education.length > 0 ? '1fr 1fr' : '1fr', gap: '18px', marginBottom: '18px' }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '12px' }}></div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '12px' }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{ 
                      backgroundColor: accentColor,
                      color: primaryColor,
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      borderRadius: '9999px', 
                      display: 'inline-block',
                      padding: '6px 12px',
                      lineHeight: '1',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '12px' }}></div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '12px' }}>
                Education
              </h2>
              <div>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: index < education.length - 1 ? '12px' : '0' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: textColor }}>{edu.degree}</h3>
                    <p style={{ color: secondaryColor, fontWeight: '500', fontSize: '0.8rem' }}>{edu.school}</p>
                    {edu.field && <p style={{ color: textSecondaryColor, fontSize: '0.8rem' }}>{edu.field}</p>}
                    <p style={{ fontSize: '0.75rem', color: textSecondaryColor, marginTop: '2px' }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '18px' }}>
            <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '12px' }}></div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '12px' }}>
              Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {projects.map((project, index) => (
                <div key={index} style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: textColor }}>{project.name}</h3>
                  {project.technologies && (
                    <p style={{ fontSize: '0.8rem', color: secondaryColor }}>{project.technologies}</p>
                  )}
                  <p style={{ color: textSecondaryColor, marginTop: '4px', fontSize: '0.8rem', lineHeight: '1.4' }}>{project.description}</p>
                  {project.link && (
                    <p style={{ fontSize: '0.8rem', color: accentColor, marginTop: '4px' }}>{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '18px' }}>
            <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '12px' }}></div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '12px' }}>
              Certifications
            </h2>
            <div>
              {certifications.map((cert, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: index < certifications.length - 1 ? '10px' : '0' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: primaryColor, borderRadius: '9999px', marginTop: '6px', marginRight: '10px', flexShrink: 0 }}></div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: textColor }}>{cert.name}</h3>
                    <p style={{ color: secondaryColor, fontSize: '0.8rem' }}>{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</p>
                    {cert.credentialId && (
                      <p style={{ fontSize: '0.7rem', color: textSecondaryColor }}>ID: {cert.credentialId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`, height: '4px', borderRadius: '2px', marginBottom: '12px' }}></div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: primaryColor, marginBottom: '12px' }}>
              References
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {references.map((ref, index) => (
                <div key={index} style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: '12px' }}>
                  <h3 style={{ fontWeight: '600', color: textColor, fontSize: '0.95rem' }}>{ref.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: textSecondaryColor }}>{ref.title}</p>
                  <p style={{ fontSize: '0.8rem', color: textSecondaryColor }}>{ref.company}</p>
                  {ref.email && <p style={{ fontSize: '0.8rem', color: accentColor }}>{ref.email}</p>}
                  {ref.phone && <p style={{ fontSize: '0.8rem', color: textSecondaryColor }}>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
