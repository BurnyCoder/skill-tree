"use client";

import { SkillTreeProvider } from '@/context/SkillTreeContext';
import SkillTree from '@/components/SkillTree';

export default function Home() {
  return (
    <main className="min-h-screen" suppressHydrationWarning>
      <SkillTreeProvider>
        <SkillTree />
      </SkillTreeProvider>
    </main>
  );
}
