import React from 'react';
import { SuggestionListProps } from '../types';

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position,
  className = '',
  style = {},
  maxHeight = '160px'
}) => {
  if (!suggestions.length) return null;

  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    top: position.top + 20,
    left: position.left,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxHeight: maxHeight,
    overflowY: 'auto',
    zIndex: 9999, // Increased z-index
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

  const hoverItemStyle: React.CSSProperties = {
    ...itemStyle,
    backgroundColor: '#f9fafb'
  };

  return (
    <div className={className} style={defaultStyle}>
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