"use client";

import { FC, useState, useEffect } from 'react';
import { Skill, SkillStatus } from '@/types';
import { useSkillTree } from '@/context/SkillTreeContext';

interface SkillFormProps {
  onClose: () => void;
}

const SkillForm: FC<SkillFormProps> = ({ onClose }) => {
  const { state, addSkill, updateSkill, setSelectedSkill } = useSkillTree();
  const { selectedSkill } = state;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<SkillStatus>(SkillStatus.TODO);
  const [parentId, setParentId] = useState<string | null>(null);
  
  // Populate form when editing an existing skill
  useEffect(() => {
    if (selectedSkill) {
      setTitle(selectedSkill.title);
      setDescription(selectedSkill.description);
      setStatus(selectedSkill.status);
      setParentId(selectedSkill.parentId);
    } else {
      resetForm();
    }
  }, [selectedSkill]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus(SkillStatus.TODO);
    setParentId(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSkill) {
      // Update existing skill
      updateSkill({
        ...selectedSkill,
        title,
        description,
        status,
        parentId
      });
    } else {
      // Add new skill
      addSkill(title, description, parentId);
    }
    
    resetForm();
    setSelectedSkill(null);
    onClose();
  };
  
  const handleCancel = () => {
    resetForm();
    setSelectedSkill(null);
    onClose();
  };

  // Recursive function to create options with proper indentation
  const renderSkillOptions = (skills: Skill[], level = 0) => {
    return skills.flatMap(skill => [
      <option key={skill.id} value={skill.id}>
        {'\u00A0'.repeat(level * 4)}{level > 0 ? '└─ ' : ''}{skill.title}
      </option>,
      ...renderSkillOptions(skill.children, level + 1)
    ]);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {selectedSkill ? 'Edit Skill' : 'Add New Skill'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SkillStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={SkillStatus.TODO}>{SkillStatus.TODO}</option>
              <option value={SkillStatus.IN_PROGRESS}>{SkillStatus.IN_PROGRESS}</option>
              <option value={SkillStatus.COMPLETED}>{SkillStatus.COMPLETED}</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Skill
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Root Level (No Parent)</option>
              {renderSkillOptions(state.skills)}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {selectedSkill ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm; 