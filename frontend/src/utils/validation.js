// Email validation - strict regex pattern
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }

  // Strict email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  // Check for common typos in domain
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain) {
    // Check for common typos
    const typos = {
      'gmail.om': 'gmail.com',
      'gmail.co': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'yahoo.co': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'outlok.com': 'outlook.com',
      'hotmai.com': 'hotmail.com',
    };
    
    if (typos[domain]) {
      return { 
        valid: false, 
        message: `Did you mean ${email.split('@')[0]}@${typos[domain]}?` 
      };
    }
  }

  // Check domain has valid TLD (at least 2 characters)
  const parts = email.split('@');
  if (parts.length === 2) {
    const domainParts = parts[1].split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      return { valid: false, message: 'Email domain is invalid' };
    }
  }

  return { valid: true, message: '' };
};

// Password validation - strong requirements
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required', strength: 0 };
  }

  const errors = [];
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  if (!checks.length) {
    errors.push('At least 8 characters');
  }
  if (!checks.uppercase) {
    errors.push('One uppercase letter');
  }
  if (!checks.lowercase) {
    errors.push('One lowercase letter');
  }
  if (!checks.number) {
    errors.push('One number');
  }
  if (!checks.special) {
    errors.push('One special character');
  }

  // Calculate strength (0-4)
  const strength = Object.values(checks).filter(Boolean).length;

  if (errors.length > 0) {
    return {
      valid: false,
      message: `Password must contain: ${errors.join(', ')}`,
      strength,
      checks,
    };
  }

  return {
    valid: true,
    message: 'Password is strong',
    strength: 5,
    checks,
  };
};

// Name validation
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 50) {
    return { valid: false, message: 'Name must be less than 50 characters' };
  }

  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, message: '' };
};

// Password match validation
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, message: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }

  return { valid: true, message: '' };
};

// Get password strength label and color
export const getPasswordStrength = (strength) => {
  if (strength === 0) return { label: '', color: '' };
  if (strength <= 1) return { label: 'Very Weak', color: 'text-red-500' };
  if (strength === 2) return { label: 'Weak', color: 'text-orange-500' };
  if (strength === 3) return { label: 'Fair', color: 'text-yellow-500' };
  if (strength === 4) return { label: 'Good', color: 'text-blue-500' };
  return { label: 'Strong', color: 'text-green-500' };
};

