"use client";

import { FC, useState, useEffect } from 'react';
import { useSkillTree } from '@/context/SkillTreeContext';
import SkillItem from './SkillItem';
import SkillForm from './SkillForm';
import GraphView from './GraphView';
import { PlusCircle, List, Network } from 'lucide-react';
import IconWrapper from './IconWrapper';

enum ViewMode {
  LIST = "list",
  GRAPH = "graph"
}

// ClientOnly HOC to render components only on the client
const ClientOnly: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  return <>{children}</>;
};

const SkillTree: FC = () => {
  const { state } = useSkillTree();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [isMounted, setIsMounted] = useState(false);
  
  // Use useEffect to ensure component only renders fully on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="p-4" suppressHydrationWarning>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interactive Skill Tree</h1>
        <ClientOnly>
          <div className="flex gap-2">
            <div className="flex border border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode(ViewMode.LIST)}
                className={`flex items-center gap-1 px-3 py-2 ${
                  viewMode === ViewMode.LIST 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                <IconWrapper icon={<List size={16} />} />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode(ViewMode.GRAPH)}
                className={`flex items-center gap-1 px-3 py-2 ${
                  viewMode === ViewMode.GRAPH 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                <IconWrapper icon={<Network size={16} />} />
                <span>Graph</span>
              </button>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              <IconWrapper icon={<PlusCircle size={18} />} />
              <span>Add New Skill</span>
            </button>
          </div>
        </ClientOnly>
      </div>
      
      {isMounted && (
        <>
          {viewMode === ViewMode.LIST ? (
            <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-6">
              {state.skills.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-4">No skills added yet</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="text-blue-400 hover:underline"
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
          ) : (
            <GraphView />
          )}
          
          {(isFormOpen || state.selectedSkill) && (
            <SkillForm onClose={() => setIsFormOpen(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default SkillTree; 