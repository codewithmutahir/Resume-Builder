import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

export const CreativeTemplate = ({ data }) => {
  const { personal, education, experience, skills, certifications, projects, references } = data;

  return (
    <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)', color: '#111827', minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#9333ea', color: 'white', padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>{personal.fullName || 'Your Name'}</h1>
          <p style={{ fontSize: '1.5rem', color: '#e9d5ff', marginBottom: '16px' }}>{personal.title || 'Professional Title'}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '16px', fontSize: '0.875rem' }}>
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

      <div style={{ padding: '32px' }}>
        {/* Summary */}
        {personal.summary && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '12px' }}>
              About Me
            </h2>
            <p style={{ color: '#374151', lineHeight: '1.625' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
              Experience
            </h2>
            <div>
              {experience.map((exp, index) => (
                <div key={index} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '4px solid #9333ea', marginBottom: index < experience.length - 1 ? '24px' : '0' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '12px', height: '12px', backgroundColor: '#9333ea', borderRadius: '9999px', marginLeft: '-8px', marginTop: '4px' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{exp.position}</h3>
                      <p style={{ color: '#7c3aed', fontWeight: '500' }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#4b5563' }}>
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <div style={{ color: '#374151', marginTop: '8px', whiteSpace: 'pre-line' }}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Education Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: education.length > 0 ? '1fr 1fr' : '1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{ 
                      background: 'linear-gradient(to right, #f3e8ff, #dbeafe)',
                      color: '#6b21a8',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      borderRadius: '9999px', 
                      display: 'inline-block',
                      padding: '8px 16px',
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

          {/* Education */}
          {education.length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
                Education
              </h2>
              <div>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: index < education.length - 1 ? '16px' : '0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{edu.degree}</h3>
                    <p style={{ color: '#7c3aed', fontWeight: '500', fontSize: '0.875rem' }}>{edu.school}</p>
                    {edu.field && <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{edu.field}</p>}
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
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
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
              Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {projects.map((project, index) => (
                <div key={index} style={{ borderLeft: '4px solid #9333ea', paddingLeft: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{project.name}</h3>
                  {project.technologies && (
                    <p style={{ fontSize: '0.875rem', color: '#7c3aed' }}>{project.technologies}</p>
                  )}
                  <p style={{ color: '#374151', marginTop: '4px', fontSize: '0.875rem' }}>{project.description}</p>
                  {project.link && (
                    <p style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '4px' }}>{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
              Certifications
            </h2>
            <div>
              {certifications.map((cert, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: index < certifications.length - 1 ? '12px' : '0' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#9333ea', borderRadius: '9999px', marginTop: '8px', marginRight: '12px', flexShrink: 0 }}></div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{cert.name}</h3>
                    <p style={{ color: '#7c3aed', fontSize: '0.875rem' }}>{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</p>
                    {cert.credentialId && (
                      <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>ID: {cert.credentialId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #9333ea, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
              References
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {references.map((ref, index) => (
                <div key={index} style={{ borderLeft: '4px solid #2563eb', paddingLeft: '16px' }}>
                  <h3 style={{ fontWeight: '600', color: '#111827' }}>{ref.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>{ref.title}</p>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>{ref.company}</p>
                  {ref.email && <p style={{ fontSize: '0.875rem', color: '#2563eb' }}>{ref.email}</p>}
                  {ref.phone && <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
