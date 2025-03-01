"use client";

import React, { ReactElement, cloneElement } from 'react';

interface IconWrapperProps {
  icon: ReactElement;
  size?: number;
}

// Define a type for icon props to avoid using 'any'
interface IconProps {
  size?: number;
}

// This component wraps Lucide icons and suppresses hydration warnings
const IconWrapper: React.FC<IconWrapperProps> = ({ icon, size }) => {
  // Create a properly typed props object for the icon
  const props: IconProps = {};
  
  // Set size if provided, otherwise keep the original size
  if (size !== undefined) {
    props.size = size;
  } else if (icon.props && typeof icon.props === 'object' && 'size' in icon.props) {
    props.size = (icon.props as { size?: number }).size;
  }

  // Clone the element with the props
  const iconWithSize = cloneElement(icon, props);

  // Wrap it in a span that has suppressHydrationWarning
  return (
    <span suppressHydrationWarning>{iconWithSize}</span>
  );
};

export default IconWrapper; 