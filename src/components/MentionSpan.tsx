import React from 'react';

interface MentionSpanProps {
  type: string;
  display: string;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

const MentionSpan: React.FC<MentionSpanProps> = ({ 
  type, 
  display, 
  value, 
  className = '',
  style = {} 
}) => {
  const defaultStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    margin: '0 2px',
    borderRadius: '4px',
    backgroundColor: type === '@' ? '#dbeafe' : '#dcfce7',
    color: type === '@' ? '#1e40af' : '#166534',
    ...style
  };

  return (
    <span
      className={className}
      style={defaultStyle}
      contentEditable={false}
      data-mention-type={type}
      data-mention-value={value}
      data-mention-display={display}
    >
      {type}{display}
    </span>
  );
};

export default MentionSpan;