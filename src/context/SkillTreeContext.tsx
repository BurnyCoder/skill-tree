"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Skill, SkillStatus, SkillTreeState } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface SkillTreeContextType {
  state: SkillTreeState;
  addSkill: (title: string, description: string, parentId: string | null) => void;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  setSelectedSkill: (skill: Skill | null) => void;
  toggleExpand: (id: string) => void;
}

const SkillTreeContext = createContext<SkillTreeContextType | undefined>(undefined);

export const useSkillTree = () => {
  const context = useContext(SkillTreeContext);
  if (!context) {
    throw new Error('useSkillTree must be used within a SkillTreeProvider');
  }
  return context;
};

interface SkillTreeProviderProps {
  children: ReactNode;
}

export const SkillTreeProvider = ({ children }: SkillTreeProviderProps) => {
  const [state, setState] = useState<SkillTreeState>({
    skills: [],
    selectedSkill: null,
  });

  // Load saved skills from localStorage on initial load
  useEffect(() => {
    const savedSkills = localStorage.getItem('skillTree');
    if (savedSkills) {
      try {
        const parsed = JSON.parse(savedSkills);
        setState(prev => ({ ...prev, skills: parsed }));
      } catch (error) {
        console.error('Failed to parse saved skills:', error);
      }
    }
  }, []);

  // Save skills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skillTree', JSON.stringify(state.skills));
  }, [state.skills]);

  const addSkill = (title: string, description: string, parentId: string | null) => {
    const newSkill: Skill = {
      id: uuidv4(),
      title,
      description,
      status: SkillStatus.TODO,
      children: [],
      parentId,
      isExpanded: true,
    };

    setState(prev => {
      // If it's a root level skill
      if (!parentId) {
        return {
          ...prev,
          skills: [...prev.skills, newSkill],
        };
      }

      // Function to recursively add child to parent
      const addChildToParent = (skills: Skill[]): Skill[] => {
        return skills.map(skill => {
          if (skill.id === parentId) {
            return {
              ...skill,
              children: [...skill.children, newSkill],
            };
          }
          
          if (skill.children.length > 0) {
            return {
              ...skill,
              children: addChildToParent(skill.children),
            };
          }
          
          return skill;
        });
      };

      return {
        ...prev,
        skills: addChildToParent(prev.skills),
      };
    });
  };

  const updateSkill = (updatedSkill: Skill) => {
    setState(prev => {
      // Function to recursively update skill
      const updateSkillRecursive = (skills: Skill[]): Skill[] => {
        return skills.map(skill => {
          if (skill.id === updatedSkill.id) {
            return updatedSkill;
          }
          
          if (skill.children.length > 0) {
            return {
              ...skill,
              children: updateSkillRecursive(skill.children),
            };
          }
          
          return skill;
        });
      };

      return {
        ...prev,
        skills: updateSkillRecursive(prev.skills),
      };
    });
  };

  const deleteSkill = (id: string) => {
    setState(prev => {
      // Function to recursively remove skill
      const removeSkill = (skills: Skill[]): Skill[] => {
        return skills
          .filter(skill => skill.id !== id)
          .map(skill => ({
            ...skill,
            children: removeSkill(skill.children),
          }));
      };

      return {
        ...prev,
        skills: removeSkill(prev.skills),
        selectedSkill: prev.selectedSkill?.id === id ? null : prev.selectedSkill,
      };
    });
  };

  const setSelectedSkill = (skill: Skill | null) => {
    setState(prev => ({
      ...prev,
      selectedSkill: skill,
    }));
  };

  const toggleExpand = (id: string) => {
    setState(prev => {
      // Function to recursively toggle isExpanded
      const toggleExpandRecursive = (skills: Skill[]): Skill[] => {
        return skills.map(skill => {
          if (skill.id === id) {
            return {
              ...skill,
              isExpanded: !skill.isExpanded,
            };
          }
          
          if (skill.children.length > 0) {
            return {
              ...skill,
              children: toggleExpandRecursive(skill.children),
            };
          }
          
          return skill;
        });
      };

      return {
        ...prev,
        skills: toggleExpandRecursive(prev.skills),
      };
    });
  };

  return (
    <SkillTreeContext.Provider
      value={{
        state,
        addSkill,
        updateSkill,
        deleteSkill,
        setSelectedSkill,
        toggleExpand,
      }}
    >
      {children}
    </SkillTreeContext.Provider>
  );
}; 