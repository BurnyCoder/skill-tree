"use client";

import { FC, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSkillTree } from '@/context/SkillTreeContext';
import { Skill } from '@/types';

// Dynamically import ForceGraph2D from the dedicated 2D package
// This avoids the A-Frame dependency issues
const ForceGraph2D = dynamic(
    () => import('react-force-graph-2d'), 
    {
        ssr: false,
        loading: () => <div className="flex justify-center items-center h-96 text-gray-300">Loading graph...</div>
    }
);

interface GraphNode {
    id: string;
    name: string;
    status: string;
    val: number; // Size of the node
}

interface GraphLink {
    source: string;
    target: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

// ClientOnly is a utility component to only render children on the client
const ClientOnly: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);
    
    useEffect(() => {
        setHasMounted(true);
    }, []);
    
    if (!hasMounted) {
        return <div className="flex justify-center items-center h-96 text-gray-300">Loading graph view...</div>;
    }
    
    return <>{children}</>;
};

const GraphView: FC = () => {
    const { state, setSelectedSkill } = useSkillTree();
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Update dimensions on window resize
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth > 1200 ? 1000 : window.innerWidth - 100,
                height: 600
            });
        };

        handleResize(); // Set initial dimensions
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Transform skills data into graph format
    useEffect(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        const processSkill = (skill: Skill) => {
            // Add node
            nodes.push({
                id: skill.id,
                name: skill.title,
                status: skill.status,
                val: 1 + (skill.children.length * 0.5) // Size nodes based on number of children
            });

            // Add links to children
            skill.children.forEach(child => {
                links.push({
                    source: skill.id,
                    target: child.id
                });
                processSkill(child);
            });
        };

        // Process all root skills
        state.skills.forEach(skill => processSkill(skill));

        setGraphData({ nodes, links });
    }, [state.skills]);

    // Handle node click to select a skill
    const handleNodeClick = useCallback((node: any) => {
        const skill = findSkillById(state.skills, node.id);
        if (skill) {
            setSelectedSkill(skill);
        }
    }, [state.skills, setSelectedSkill]);

    // Get color for node based on skill status
    const getNodeColor = (node: any) => {
        switch (node.status) {
            case 'To Do':
                return '#6b7280'; // gray-500 for dark mode
            case 'In Progress':
                return '#3b82f6'; // blue-500 for dark mode
            case 'Completed':
                return '#10b981'; // green-500 for dark mode
            default:
                return '#4b5563'; // gray-600 for dark mode
        }
    };

    // Get link color for dark mode
    const getLinkColor = () => {
        return 'rgba(156, 163, 175, 0.5)'; // gray-400 with opacity for dark mode
    };

    // Get background color for the canvas
    const getBackgroundColor = () => {
        return '#111827'; // gray-900 for dark mode background
    };

    return (
        <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-6 h-full">
            {graphData.nodes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <p>No skills to display in the graph</p>
                </div>
            ) : (
                <ClientOnly>
                    <ForceGraph2D
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        nodeLabel={(node: any) => `${node.name} (${node.status})`}
                        nodeColor={getNodeColor}
                        linkColor={getLinkColor}
                        backgroundColor={getBackgroundColor}
                        linkDirectionalArrowLength={3.5}
                        linkDirectionalArrowRelPos={1}
                        cooldownTicks={100}
                        onNodeClick={handleNodeClick}
                    />
                </ClientOnly>
            )}
        </div>
    );
};

// Helper function to find a skill by ID recursively
function findSkillById(skills: Skill[], id: string): Skill | null {
    for (const skill of skills) {
        if (skill.id === id) {
            return skill;
        }
        if (skill.children.length > 0) {
            const foundInChildren = findSkillById(skill.children, id);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
    }
    return null;
}

export default GraphView; 