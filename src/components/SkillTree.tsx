"use client";

import { FC, useState } from 'react';
import { useSkillTree } from '@/context/SkillTreeContext';
import SkillItem from './SkillItem';
import SkillForm from './SkillForm';
import { PlusCircle } from 'lucide-react';
import IconWrapper from './IconWrapper';

const SkillTree: FC = () => {
  const { state } = useSkillTree();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <div className="p-4" suppressHydrationWarning>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interactive Skill Tree</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <IconWrapper icon={<PlusCircle size={18} />} />
          <span>Add New Skill</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {state.skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No skills added yet</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-blue-600 hover:underline"
            >
              Add your first skill
            </button>
          </div>
        ) : (
          <div>
            {state.skills.map((skill) => (
              <SkillItem key={skill.id} skill={skill} level={0} />
            ))}
          </div>
        )}
      </div>
      
      {(isFormOpen || state.selectedSkill) && (
        <SkillForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default SkillTree; 