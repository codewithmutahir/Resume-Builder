import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_TYPOGRAPHY_BY_TEMPLATE } from '@/constants/typography';

const ResumeContext = createContext();

 const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

const STORAGE_KEY = 'resume_builder_data';
const COLOR_STORAGE_KEY = 'resume_builder_colors';
const TYPOGRAPHY_STORAGE_KEY = 'resume_builder_typography';

// Default colors for each template
const defaultColors = {
  modern: {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#dbeafe',
    text: '#111827',
    textSecondary: '#374151'
  },
  classic: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#9ca3af',
    text: '#111827',
    textSecondary: '#374151'
  },
  minimal: {
    primary: '#6b7280',
    secondary: '#4b5563',
    accent: '#9ca3af',
    text: '#111827',
    textSecondary: '#374151'
  },
  elegant: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#9ca3af',
    text: '#111827',
    textSecondary: '#374151'
  },
  creative: {
    primary: '#9333ea',
    secondary: '#7c3aed',
    accent: '#2563eb',
    text: '#111827',
    textSecondary: '#374151'
  }
};

const defaultTypography = { ...DEFAULT_TYPOGRAPHY_BY_TEMPLATE };

const initialData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    picture: ''
  },
  education: [],
  experience: [],
  skills: [],
  certifications: [],
  projects: [],
  references: []
};

const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(() => {
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialData;
    } catch (error) {
      console.error('Error loading resume data:', error);
      return initialData;
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  
  // Color state - load from localStorage or use defaults
  const [templateColors, setTemplateColors] = useState(() => {
    try {
      const saved = localStorage.getItem(COLOR_STORAGE_KEY);
      if (saved) {
        const savedColors = JSON.parse(saved);
        // Merge saved colors with defaults to ensure all templates have colors
        return { ...defaultColors, ...savedColors };
      }
      return defaultColors;
    } catch (error) {
      console.error('Error loading color data:', error);
      return defaultColors;
    }
  });

  const [templateTypography, setTemplateTypography] = useState(() => {
    try {
      const saved = localStorage.getItem(TYPOGRAPHY_STORAGE_KEY);
      if (saved) {
        return { ...defaultTypography, ...JSON.parse(saved) };
      }
      return defaultTypography;
    } catch (error) {
      console.error('Error loading typography data:', error);
      return defaultTypography;
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (error) {
      console.error('Error saving resume data:', error);
    }
  }, [resumeData]);

  // Save colors to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(templateColors));
    } catch (error) {
      console.error('Error saving color data:', error);
    }
  }, [templateColors]);

  useEffect(() => {
    try {
      localStorage.setItem(TYPOGRAPHY_STORAGE_KEY, JSON.stringify(templateTypography));
    } catch (error) {
      console.error('Error saving typography data:', error);
    }
  }, [templateTypography]);

  const updatePersonal = (data) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...data },
    }));
  };

  const updateEducation = (education) => {
    setResumeData((prev) => ({
      ...prev,
      education:
        typeof education === 'function' ? education(prev.education || []) : education,
    }));
  };

  const updateExperience = (experience) => {
    setResumeData((prev) => ({
      ...prev,
      experience:
        typeof experience === 'function'
          ? experience(prev.experience || [])
          : experience,
    }));
  };

  const updateSkills = (skills) => {
    setResumeData((prev) => ({
      ...prev,
      skills: typeof skills === 'function' ? skills(prev.skills || []) : skills,
    }));
  };

  const updateCertifications = (certifications) => {
    setResumeData(prev => ({ ...prev, certifications }));
  };

  const updateProjects = (projects) => {
    setResumeData(prev => ({ ...prev, projects }));
  };

  const updateReferences = (references) => {
    setResumeData(prev => ({ ...prev, references }));
  };

  const updateTemplateColors = (templateId, colors) => {
    setTemplateColors(prev => ({
      ...prev,
      [templateId]: { ...prev[templateId], ...colors }
    }));
  };

  const updateTemplateTypography = (templateId, presetId) => {
    setTemplateTypography((prev) => ({
      ...prev,
      [templateId]: presetId,
    }));
  };

  const resetResume = () => {
    setResumeData(initialData);
    setCurrentStep(0);
    setTemplateColors(defaultColors);
    setTemplateTypography(defaultTypography);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COLOR_STORAGE_KEY);
    localStorage.removeItem(TYPOGRAPHY_STORAGE_KEY);
  };

  const value = {
    resumeData,
    currentStep,
    setCurrentStep,
    selectedTemplate,
    setSelectedTemplate,
    templateColors,
    updateTemplateColors,
    templateTypography,
    updateTemplateTypography,
    updatePersonal,
    updateEducation,
    updateExperience,
    updateSkills,
    updateCertifications,
    updateProjects,
    updateReferences,
    resetResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

export {  ResumeProvider, useResume };
