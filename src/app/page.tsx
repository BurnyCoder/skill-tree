"use client";

import { SkillTreeProvider } from '@/context/SkillTreeContext';
import SkillTree from '@/components/SkillTree';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <SkillTreeProvider>
        <SkillTree />
      </SkillTreeProvider>
    </main>
  );
}
