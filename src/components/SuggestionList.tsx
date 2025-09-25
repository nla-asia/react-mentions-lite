import React, { useRef, useEffect, useState } from 'react';
import { SuggestionListProps } from '../types';

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position,
  suggestionPosition = 'bottomLeft',
  className = '',
  style = {},
  maxHeight = '160px'
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(200); // Default min width

  useEffect(() => {
    if (listRef.current) {
      setDropdownWidth(listRef.current.offsetWidth);
    }
  }, [suggestions]);

  if (!suggestions.length) return null;

  // Calculate position based on suggestionPosition
  const calculatePosition = () => {
    const baseTop = position.top + 2;
    const baseLeft = position.left;
    const estimatedWidth = Math.max(dropdownWidth, 200); // Use measured width or minimum

    switch (suggestionPosition) {
      case 'bottomLeft':
        return { top: baseTop, left: baseLeft };
      case 'bottomRight':
        return { top: baseTop, left: baseLeft - estimatedWidth + 20 }; // Align right edge with caret
      case 'bottomCenter':
        return { top: baseTop, left: baseLeft - estimatedWidth / 2 + 10 }; // Center on caret
      case 'topLeft':
        return { top: baseTop - 170, left: baseLeft }; // Position above (estimate dropdown height)
      case 'topRight':
        return { top: baseTop - 170, left: baseLeft - estimatedWidth + 20 };
      case 'topCenter':
        return { top: baseTop - 170, left: baseLeft - estimatedWidth / 2 + 10 };
      default:
        return { top: baseTop, left: baseLeft };
    }
  };

  const calculatedPosition = calculatePosition();

  const defaultStyle: React.CSSProperties = {
    position: 'fixed', // Changed from absolute to fixed for portal rendering
    top: calculatedPosition.top,
    left: calculatedPosition.left,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxHeight: maxHeight,
    overflowY: 'auto',
    zIndex: 9999,
    minWidth: '200px',
    ...style
  };

  const itemStyle: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #f3f4f6'
  };

  const selectedItemStyle: React.CSSProperties = {
    ...itemStyle,
    backgroundColor: '#eff6ff'
  };

  return (
    <div ref={listRef} className={className} style={defaultStyle}>
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.id}
          style={index === selectedIndex ? selectedItemStyle : itemStyle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(suggestion);
          }}
          onMouseEnter={(e) => {
            if (index !== selectedIndex) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }
          }}
          onMouseLeave={(e) => {
            if (index !== selectedIndex) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {suggestion.display}
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;