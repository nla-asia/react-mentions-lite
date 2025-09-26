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
  minHeight = '0px',
  suggestionTitle
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState(200); // Default min width

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex + (suggestionTitle ? 1 : 0)] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }
  }, [selectedIndex, suggestionTitle]);

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

  // Extract maxHeight and minHeight from style props or use defaults
  const effectiveMaxHeight = (style?.maxHeight as string) || maxHeight;
  const effectiveMinHeight = (style?.minHeight as string) || minHeight;

  const wrapperStyle: React.CSSProperties = {
    position: 'fixed',
    top: calculatedPosition.top,
    left: calculatedPosition.left,
    zIndex: 9999,
    padding: '8px' // Add padding around the dropdown for better visual spacing
  };

  const listStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    minWidth: '200px',
    ...style
  };

  const itemStyle: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    fontSize: 'inherit',
    fontFamily: 'inherit'
  };

  const selectedItemStyle: React.CSSProperties = {
    ...itemStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
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
    <div style={wrapperStyle}>
      {suggestionTitle && (
        <div style={{
          ...titleStyle,
          position: 'relative',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {suggestionTitle}
        </div>
      )}
      <div 
        ref={listRef} 
        className={className} 
        style={{
          ...listStyle,
          maxHeight: suggestionTitle ? `calc(${effectiveMaxHeight} - 40px)` : effectiveMaxHeight,
          minHeight: suggestionTitle ? `calc(${effectiveMinHeight} - 40px)` : effectiveMinHeight,
          overflowY: 'auto'
        }}
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            type="button"
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
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionList;