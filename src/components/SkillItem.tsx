"use client";

import { FC } from 'react';
import { Skill, SkillStatus } from '@/types';
import { useSkillTree } from '@/context/SkillTreeContext';
import { ChevronDown, ChevronRight, Edit, Trash, Plus } from 'lucide-react';
import IconWrapper from './IconWrapper';

interface SkillItemProps {
  skill: Skill;
  level: number;
}

const SkillItem: FC<SkillItemProps> = ({ skill, level }) => {
  const { toggleExpand, setSelectedSkill, deleteSkill, addSkill } = useSkillTree();

  const getStatusColor = (status: SkillStatus) => {
    switch (status) {
      case SkillStatus.TODO:
        return 'bg-gray-200';
      case SkillStatus.IN_PROGRESS:
        return 'bg-blue-200';
      case SkillStatus.COMPLETED:
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const handleAddSubskill = (e: React.MouseEvent) => {
    e.stopPropagation();
    addSkill('New Skill', 'Description for the new skill', skill.id);
  };

  const handleEditSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSkill(skill);
  };

  const handleDeleteSkill = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSkill(skill.id);
  };

  const handleToggleExpand = () => {
    toggleExpand(skill.id);
  };

  return (
    <div className="select-none" suppressHydrationWarning>
      <div 
        className={`flex items-center p-2 rounded-md mb-1 cursor-pointer hover:bg-gray-100 ${getStatusColor(skill.status)}`}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={handleToggleExpand}
      >
        <div className="mr-2">
          {skill.children.length > 0 && (
            <button onClick={handleToggleExpand} className="mr-1">
              {skill.isExpanded ? 
                <IconWrapper icon={<ChevronDown size={16} />} /> : 
                <IconWrapper icon={<ChevronRight size={16} />} />
              }
            </button>
          )}
        </div>
        <div className="flex-grow font-medium">{skill.title}</div>
        <div className="flex space-x-1">
          <button 
            onClick={handleAddSubskill}
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded"
            title="Add Sub-skill"
          >
            <IconWrapper icon={<Plus size={16} />} />
          </button>
          <button 
            onClick={handleEditSkill}
            className="p-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-100 rounded"
            title="Edit Skill"
          >
            <IconWrapper icon={<Edit size={16} />} />
          </button>
          <button 
            onClick={handleDeleteSkill}
            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded"
            title="Delete Skill"
          >
            <IconWrapper icon={<Trash size={16} />} />
          </button>
        </div>
      </div>
      
      {skill.isExpanded && skill.children.length > 0 && (
        <div className="skill-children">
          {skill.children.map((childSkill) => (
            <SkillItem key={childSkill.id} skill={childSkill} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillItem; 