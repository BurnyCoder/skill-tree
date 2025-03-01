export enum SkillStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed"
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  status: SkillStatus;
  children: Skill[];
  parentId: string | null;
  isExpanded?: boolean;
}

export interface SkillTreeState {
  skills: Skill[];
  selectedSkill: Skill | null;
} 