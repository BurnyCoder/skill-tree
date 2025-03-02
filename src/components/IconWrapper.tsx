"use client";

import React, { ReactElement, cloneElement } from 'react';

interface IconWrapperProps {
  icon: ReactElement;
  size?: number;
}

// Define a type for icon props to avoid using 'any'
interface IconProps {
  size?: number;
  suppressHydrationWarning?: boolean;
}

// This component wraps Lucide icons and suppresses hydration warnings
const IconWrapper: React.FC<IconWrapperProps> = ({ icon, size }) => {
  // Create a properly typed props object for the icon
  const props: IconProps = {
    // Add suppressHydrationWarning to the icon itself
    suppressHydrationWarning: true
  };
  
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
    <span 
      suppressHydrationWarning
      // Add a class to help identify these wrappers in debugging
      className="icon-wrapper"
      // Use a custom data attribute for additional SVG protection
      data-suppress-hydration="true"
    >
      {iconWithSize}
    </span>
  );
};

export default IconWrapper; 