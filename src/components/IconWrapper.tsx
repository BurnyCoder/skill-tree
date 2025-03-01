"use client";

import React, { ReactElement, cloneElement } from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: ReactElement;
  size?: number;
}

// This component wraps Lucide icons and suppresses hydration warnings
const IconWrapper: React.FC<IconWrapperProps> = ({ icon, size }) => {
  // Clone the element and add suppressHydrationWarning
  const iconWithSuppress = cloneElement(icon, {
    suppressHydrationWarning: true,
    size: size || icon.props.size,
  });

  return (
    <span suppressHydrationWarning>{iconWithSuppress}</span>
  );
};

export default IconWrapper; 