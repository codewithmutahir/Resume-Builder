import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Check } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import skillsData from '@/skills.json';

// Debounce hook for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const [skills, setSkills] = useState(resumeData.skills);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const containerRef = useRef(null);

  // Debounce input value for performance (300ms delay)
  const debouncedInput = useDebounce(inputValue, 300);

  // Filter suggestions based on debounced input
  const filteredSuggestions = useMemo(() => {
    if (!debouncedInput.trim()) {
      return [];
    }

    const query = debouncedInput.toLowerCase().trim();
    const filtered = skillsData
      .filter(skill => {
        const skillLower = skill.toLowerCase();
        return skillLower.includes(query) && !skills.includes(skill);
      })
      .slice(0, 8); // Limit to 8 suggestions for better performance

    return filtered;
  }, [debouncedInput, skills]);

  // Update suggestions when filtered results change
  useEffect(() => {
    setSuggestions(filteredSuggestions);
    setSelectedIndex(-1);
    setShowSuggestions(filteredSuggestions.length > 0 && inputValue.trim().length > 0);
  }, [filteredSuggestions, inputValue]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAdd = useCallback((skillToAdd = null) => {
    const skill = skillToAdd || inputValue.trim();
    if (skill && !skills.includes(skill)) {
      const newSkills = [...skills, skill];
      setSkills(newSkills);
      updateSkills(newSkills);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  }, [inputValue, skills, updateSkills]);

  const handleRemove = useCallback((skillToRemove) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    updateSkills(newSkills);
  }, [updateSkills]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleAdd(suggestions[selectedIndex]);
        } else {
          handleAdd();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleAdd(suggestion);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Skills</h2>
        <p className="text-sm text-muted-foreground">Add your professional skills. Start typing to see suggestions or press Enter to add.</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2 relative" ref={containerRef}>
            <Label htmlFor="skill-input">Add a skill</Label>
            <Input
              ref={inputRef}
              id="skill-input"
              placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0 && inputValue.trim().length > 0) {
                  setShowSuggestions(true);
                }
              }}
              autoComplete="off"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-auto"
                >
                  <ul className="py-1" role="listbox">
                    {suggestions.map((suggestion, index) => {
                      const isSelected = index === selectedIndex;
                      const isAlreadyAdded = skills.includes(suggestion);
                      
                      return (
                        <li
                          key={suggestion}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isAlreadyAdded}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                              isSelected
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                            } ${
                              isAlreadyAdded
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <span>{suggestion}</span>
                            {isAlreadyAdded && (
                              <Check className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="self-end">
            <Button 
              onClick={() => handleAdd()} 
              type="button"
              disabled={!inputValue.trim()}
            >
              Add Skill
            </Button>
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <Label className="mb-3 block">Your Skills ({skills.length})</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary/80 transition-smooth"
                >
                  {skill}
                  <button
                    onClick={() => handleRemove(skill)}
                    className="hover:text-destructive transition-smooth"
                    type="button"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">No skills added yet. Start adding your skills above.</p>
          </div>
        )}
      </div>
    </Card>
  );
};


