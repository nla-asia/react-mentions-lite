import React, { useRef, useEffect, useState } from 'react';
import { SuggestionListProps } from '../types';

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position,
  suggestionPosition = 'bottomLeft',
  inputRect,
  dropdownOffset,
  className = '',
  style = {},
  maxHeight = '160px',
  suggestionTitle
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
    const isInputRelative = suggestionPosition?.startsWith('input');
    const baseRect = isInputRelative && inputRect ? inputRect : { ...position, width: 0, height: 0 };
    
    const estimatedWidth = Math.max(dropdownWidth, 200); // Use measured width or minimum

    switch (suggestionPosition) {
      case 'bottomLeft':
        return { 
          top: position.top + 2, 
          left: position.left 
        };
      case 'bottomRight':
        return { 
          top: position.top + 2, 
          left: position.left - estimatedWidth + 20 
        };
      case 'bottomCenter':
        return { 
          top: position.top + 2, 
          left: position.left - estimatedWidth / 2 + 10 
        };
      case 'topLeft':
        return { 
          top: position.top - 170, 
          left: position.left 
        };
      case 'topRight':
        return { 
          top: position.top - 170, 
          left: position.left - estimatedWidth + 20 
        };
      case 'topCenter':
        return { 
          top: position.top - 170, 
          left: position.left - estimatedWidth / 2 + 10 
        };
      case 'inputBottomLeft':
        return { 
          top: baseRect.top + baseRect.height, 
          left: baseRect.left 
        };
      case 'inputBottomRight':
        return { 
          top: baseRect.top + baseRect.height, 
          left: baseRect.left + baseRect.width - estimatedWidth 
        };
      case 'inputBottomCenter':
        return { 
          top: baseRect.top + baseRect.height, 
          left: baseRect.left + baseRect.width / 2 - estimatedWidth / 2 
        };
      case 'inputTopLeft':
        return { 
          top: baseRect.top - (dropdownOffset ?? 130), 
          left: baseRect.left 
        };
      case 'inputTopRight':
        return { 
          top: baseRect.top - (dropdownOffset ?? 130), 
          left: baseRect.left + baseRect.width - estimatedWidth 
        };
      case 'inputTopCenter':
        return { 
          top: baseRect.top - (dropdownOffset ?? 130), 
          left: baseRect.left + baseRect.width / 2 - estimatedWidth / 2 
        };
      default:
        return { top: position.top + 2, left: position.left };
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

  const titleStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };

  return (
    <div ref={listRef} className={className} style={defaultStyle}>
      {suggestionTitle && (
        <div style={titleStyle}>
          {suggestionTitle}
        </div>
      )}
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