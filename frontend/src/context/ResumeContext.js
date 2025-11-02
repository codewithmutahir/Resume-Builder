import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

 const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

const STORAGE_KEY = 'resume_builder_data';

const initialData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
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

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (error) {
      console.error('Error saving resume data:', error);
    }
  }, [resumeData]);

  const updatePersonal = (data) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...data }
    }));
  };

  const updateEducation = (education) => {
    setResumeData(prev => ({ ...prev, education }));
  };

  const updateExperience = (experience) => {
    setResumeData(prev => ({ ...prev, experience }));
  };

  const updateSkills = (skills) => {
    setResumeData(prev => ({ ...prev, skills }));
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

  const resetResume = () => {
    setResumeData(initialData);
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    resumeData,
    currentStep,
    setCurrentStep,
    selectedTemplate,
    setSelectedTemplate,
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