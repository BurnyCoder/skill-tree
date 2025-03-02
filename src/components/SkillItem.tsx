"use client";

import { FC } from 'react';
import { Skill, SkillStatus } from '@/types';
import { useSkillTree } from '@/context/SkillTreeContext';
import { ChevronDown, ChevronRight, Edit, Trash, Plus, CheckCircle, Circle, Clock } from 'lucide-react';
import IconWrapper from './IconWrapper';

interface SkillItemProps {
  skill: Skill;
  level: number;
}

const SkillItem: FC<SkillItemProps> = ({ skill, level }) => {
  const { toggleExpand, setSelectedSkill, deleteSkill, addSkill, updateSkill } = useSkillTree();

  const getStatusStyles = (status: SkillStatus) => {
    switch (status) {
      case SkillStatus.TODO:
        return 'bg-gray-700 border-l-4 border-gray-500 todo-item';
      case SkillStatus.IN_PROGRESS:
        return 'bg-indigo-800 border-l-4 border-indigo-500 in-progress-item';
      case SkillStatus.COMPLETED:
        return 'bg-green-800 border-l-4 border-green-500 completed-item';
      default:
        return 'bg-gray-700 border-l-4 border-gray-500 todo-item';
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

  const changeStatus = (newStatus: SkillStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSkill({
      ...skill,
      status: newStatus
    });
  };

  const getStatusIcon = (status: SkillStatus) => {
    switch (status) {
      case SkillStatus.TODO:
        return <IconWrapper icon={<Circle size={16} className="text-gray-400" />} />;
      case SkillStatus.IN_PROGRESS:
        return <IconWrapper icon={<Clock size={16} className="text-indigo-400" />} />;
      case SkillStatus.COMPLETED:
        return <IconWrapper icon={<CheckCircle size={16} className="text-green-400" />} />;
      default:
        return <IconWrapper icon={<Circle size={16} className="text-gray-400" />} />;
    }
  };

  const renderStatusButtons = () => {
    return (
      <div className="status-buttons flex space-x-1 mr-2" onClick={e => e.stopPropagation()}>
        <button 
          className={`p-1 rounded-full transition-all duration-200 ${skill.status === SkillStatus.TODO ? 'bg-gray-600 scale-110' : 'bg-gray-700 opacity-60'}`}
          onClick={(e) => changeStatus(SkillStatus.TODO, e)}
          title="Mark as To Do"
        >
          <IconWrapper icon={<Circle size={16} className="text-gray-300" />} />
        </button>
        <button 
          className={`p-1 rounded-full transition-all duration-200 ${skill.status === SkillStatus.IN_PROGRESS ? 'bg-indigo-600 scale-110' : 'bg-gray-700 opacity-60'}`}
          onClick={(e) => changeStatus(SkillStatus.IN_PROGRESS, e)}
          title="Mark as In Progress"
        >
          <IconWrapper icon={<Clock size={16} className="text-indigo-300" />} />
        </button>
        <button 
          className={`p-1 rounded-full transition-all duration-200 ${skill.status === SkillStatus.COMPLETED ? 'bg-green-600 scale-110' : 'bg-gray-700 opacity-60'}`}
          onClick={(e) => changeStatus(SkillStatus.COMPLETED, e)}
          title="Mark as Completed"
        >
          <IconWrapper icon={<CheckCircle size={16} className="text-green-300" />} />
        </button>
      </div>
    );
  };

  return (
    <div className="select-none" suppressHydrationWarning>
      <div 
        className={`flex items-center p-2 rounded-md mb-1 cursor-pointer hover:bg-opacity-80 skill-item-transition ${getStatusStyles(skill.status)}`}
        style={{ 
          marginLeft: `${level * 20}px`,
          ...(skill.status === SkillStatus.TODO ? { backgroundColor: '#374151' } : {})
        }}
        onClick={handleToggleExpand}
      >
        <div className="mr-2">
          {skill.children.length > 0 && (
            <button onClick={handleToggleExpand} className="mr-1">
              {skill.isExpanded ? 
                <IconWrapper icon={<ChevronDown size={16} className="text-gray-300" />} /> : 
                <IconWrapper icon={<ChevronRight size={16} className="text-gray-300" />} />
              }
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="status-indicator">
            {getStatusIcon(skill.status)}
          </span>
          <div className="font-medium">{skill.title}</div>
        </div>
        <div className="flex-grow"></div>
        {renderStatusButtons()}
        <div className="flex space-x-1">
          <button 
            onClick={handleAddSubskill}
            className="p-1 text-gray-300 hover:text-blue-600 hover:bg-blue-100 rounded"
            title="Add Sub-skill"
          >
            <IconWrapper icon={<Plus size={16} />} />
          </button>
          <button 
            onClick={handleEditSkill}
            className="p-1 text-gray-300 hover:text-yellow-600 hover:bg-yellow-100 rounded"
            title="Edit Skill"
          >
            <IconWrapper icon={<Edit size={16} />} />
          </button>
          <button 
            onClick={handleDeleteSkill}
            className="p-1 text-gray-300 hover:text-red-600 hover:bg-red-100 rounded"
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