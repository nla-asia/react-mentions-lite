import React, { useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { MentionsProps } from '../types';
import { useMentions } from '../hooks/useMentions';
import SuggestionList from './SuggestionList';

export interface MentionsRef {
  clear: () => void;
}

const ReactMentionsLite = forwardRef<MentionsRef, MentionsProps>(({
  placeholder = "Type to mention...",
  className = '',
  style = {},
  triggers,
  onContentChange,
  maxSuggestions = 10,
  suggestionStyle,
  suggestionClassName,
  disabled = false,
  autoFocus = false,
  maxHeight = '200px',
  minHeight = '96px',
  onKeyDown,
  suggestionPosition = 'bottomLeft',
  dropdownOffset
}, ref) => {
  const {
    suggestions,
    setSuggestions,
    selectedIndex,
    setSelectedIndex,
    suggestionPosition: position,
    setSuggestionPosition,
    currentTrigger,
    setCurrentTrigger,
    searchTerm,
    setSearchTerm,
    storedRange,
    setStoredRange,
    editorRef,
    getTriggerConfig,
    getSuggestions,
    getCaretPosition,
    parseMentions,
    getPlainText
  } = useMentions(triggers, maxSuggestions);

  // Expose clear method to parent component
  useImperativeHandle(ref, () => ({
    clear: () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        // Also clear any stored state
        setSuggestions([]);
        setCurrentTrigger(null);
        setSearchTerm('');
        setSelectedIndex(0);
        // Trigger onContentChange with empty content
        onContentChange?.('', '', []);
      }
    }
  }), [onContentChange]);

  const insertMention = useCallback((suggestion: any) => {
    // Ensure the editor has focus
    if (editorRef.current && !editorRef.current.contains(document.activeElement)) {
      editorRef.current.focus();
    }

    // Use stored range if available (for clicks), otherwise use current selection (for keyboard)
    const selection = window.getSelection();
    const rangeToUse = storedRange || (selection?.rangeCount ? selection.getRangeAt(0) : null);

    if (!rangeToUse || !currentTrigger) return;

    const textNode = rangeToUse.startContainer;
    const textContent = textNode.textContent || '';
    const cursorPos = rangeToUse.startOffset;

    let triggerPos = cursorPos - 1;
    while (triggerPos >= 0 && textContent[triggerPos] !== currentTrigger.trigger) {
      triggerPos--;
    }

    if (triggerPos >= 0) {
      const newRange = document.createRange();
      newRange.setStart(textNode, triggerPos);
      newRange.setEnd(textNode, cursorPos);

      const mentionElement = document.createElement('span');
      const triggerConfig = currentTrigger;

      // Apply custom styles
      Object.assign(mentionElement.style, {
        display: 'inline-block',
        padding: '2px 8px',
        margin: '0 2px',
        borderRadius: '4px',
        backgroundColor: triggerConfig.trigger === '@' ? '#dbeafe' : '#dcfce7',
        color: triggerConfig.trigger === '@' ? '#1e40af' : '#166534',
        ...triggerConfig.style
      });

      if (triggerConfig.className) {
        mentionElement.className = triggerConfig.className;
      }

      mentionElement.contentEditable = 'false';
      mentionElement.setAttribute('data-mention-type', triggerConfig.trigger);
      mentionElement.setAttribute('data-mention-value', suggestion.value);
      mentionElement.setAttribute('data-mention-display', suggestion.display);
      mentionElement.textContent = `${triggerConfig.trigger}${suggestion.display}`;

      newRange.deleteContents();
      newRange.insertNode(mentionElement);

      const spaceNode = document.createTextNode(' ');
      newRange.setStartAfter(mentionElement);
      newRange.insertNode(spaceNode);

      newRange.setStartAfter(spaceNode);
      newRange.collapse(true);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    setSuggestions([]);
    setCurrentTrigger(null);
    setSearchTerm('');
    setSelectedIndex(0);
    setStoredRange(null); // Clear stored range after use

    updateContent();
  }, [currentTrigger, setSuggestions, setCurrentTrigger, setSearchTerm, setSelectedIndex]);

  const updateContent = useCallback(() => {
    if (editorRef.current && onContentChange) {
      const htmlContent = editorRef.current.innerHTML;
      const plainText = getPlainText(htmlContent);
      const mentions = parseMentions(htmlContent);
      onContentChange(htmlContent, plainText, mentions);
    }
  }, [onContentChange, getPlainText, parseMentions]);

  const handleInput = useCallback(() => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    const cursorPos = range.startOffset;

    if (textNode.nodeType === Node.TEXT_NODE) {
      const textContent = textNode.textContent || '';
      const charBeforeCursor = textContent[cursorPos - 1];

      const triggerConfig = getTriggerConfig(charBeforeCursor);
      if (triggerConfig) {
        // Store the current range for later use when clicking suggestions
        setStoredRange(range.cloneRange());
        setCurrentTrigger(triggerConfig);
        setSearchTerm('');
        setSelectedIndex(0);

        const position = getCaretPosition();
        if (position) {
          setSuggestionPosition(position);
        }

        const suggestions = getSuggestions(triggerConfig, '');
        setSuggestions(suggestions);
        return;
      }

      if (currentTrigger) {
        let triggerPos = cursorPos - 1;
        while (triggerPos >= 0 && textContent[triggerPos] !== currentTrigger.trigger) {
          triggerPos--;
        }

        if (triggerPos >= 0) {
          const newSearchTerm = textContent.slice(triggerPos + 1, cursorPos);

          if (newSearchTerm.includes(' ') || newSearchTerm.includes('\n')) {
            setSuggestions([]);
            setCurrentTrigger(null);
            setSearchTerm('');
          } else {
            setSearchTerm(newSearchTerm);
            const newSuggestions = getSuggestions(currentTrigger, newSearchTerm);
            setSuggestions(newSuggestions);
            setSelectedIndex(0);
          }
        } else {
          setSuggestions([]);
          setCurrentTrigger(null);
          setSearchTerm('');
        }
      }
    }

    updateContent();
  }, [currentTrigger, getTriggerConfig, getSuggestions, getCaretPosition, updateContent,
      setCurrentTrigger, setSearchTerm, setSelectedIndex, setSuggestions, setSuggestionPosition]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev === 0 ? suggestions.length - 1 : prev - 1);
          break;
        case 'Tab':
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            insertMention(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setSuggestions([]);
          setCurrentTrigger(null);
          setSearchTerm('');
          break;
      }
    } else if (onKeyDown) {
      // Call external onKeyDown when there are no suggestions
      onKeyDown(e);
    }
  }, [suggestions, selectedIndex, insertMention, setSuggestions, setCurrentTrigger, setSearchTerm, setSelectedIndex, onKeyDown]);

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    insertMention(suggestion);
  }, [insertMention]);

  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  const getInputRect = useCallback(() => {
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      };
    }
    return { top: 0, left: 0, width: 0, height: 0 };
  }, []);

  const isInputRelativePosition = suggestionPosition?.startsWith('input');

  const editorStyle: React.CSSProperties = {
    width: '100%',
    minHeight: minHeight,
    maxHeight: maxHeight,
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    overflowY: 'auto',
    ...style
  };

  return (
    <div className={`rml-container ${className}`} style={{ position: 'relative' }}>
      <div
        ref={editorRef}
        style={editorStyle}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        className="rml-editor"
      />

      {suggestions.length > 0 && ReactDOM.createPortal(
        <SuggestionList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSuggestionSelect}
          position={position}
          suggestionPosition={suggestionPosition}
          inputRect={isInputRelativePosition ? getInputRect() : undefined}
          dropdownOffset={dropdownOffset}
          className={suggestionClassName}
          style={suggestionStyle}
          suggestionTitle={currentTrigger?.suggestionTitle}
        />,
        document.body
      )}

      <style>{`
        .rml-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .rml-editor:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
});

export default ReactMentionsLite;