import { useState, useRef, useCallback } from 'react';
import { MentionItem, MentionTriggerConfig, MentionPosition, ParsedMention } from '../types';

export const useMentions = (triggers: MentionTriggerConfig[], maxSuggestions: number = 10) => {
  const [suggestions, setSuggestions] = useState<MentionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestionPosition, setSuggestionPosition] = useState<MentionPosition>({ top: 0, left: 0 });
  const [currentTrigger, setCurrentTrigger] = useState<MentionTriggerConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [storedRange, setStoredRange] = useState<Range | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  const getTriggerConfig = useCallback((triggerChar: string): MentionTriggerConfig | null => {
    return triggers.find(t => t.trigger === triggerChar) || null;
  }, [triggers]);

  const getSuggestions = useCallback((triggerConfig: MentionTriggerConfig, term: string): MentionItem[] => {
    if (!term) return triggerConfig.data.slice(0, maxSuggestions);
    
    const filtered = triggerConfig.data.filter(item => 
      item.display.toLowerCase().includes(term.toLowerCase()) ||
      item.value.toLowerCase().includes(term.toLowerCase())
    );
    
    return filtered.slice(0, maxSuggestions);
  }, [maxSuggestions]);

  const getCaretPosition = useCallback((): MentionPosition | null => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Return viewport coordinates for portal rendering
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    };
  }, []);

  const parseMentions = useCallback((html: string): ParsedMention[] => {
    const mentions: ParsedMention[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const mentionElements = doc.querySelectorAll('[data-mention-type]');
    mentionElements.forEach((element, index) => {
      const type = element.getAttribute('data-mention-type') || '';
      const value = element.getAttribute('data-mention-value') || '';
      const display = element.getAttribute('data-mention-display') || '';
      const id = element.getAttribute('data-mention-id') || '';
      
      mentions.push({
        type,
        value,
        display,
        index,
        id
      });
    });
    
    return mentions;
  }, []);

  const getPlainText = useCallback((html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const extractText = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.hasAttribute('data-mention-type')) {
          const type = element.getAttribute('data-mention-type') || '';
          const value = element.getAttribute('data-mention-value') || '';
          return `${type}${value}`;
        } else {
          let text = '';
          for (const child of element.childNodes) {
            text += extractText(child);
          }
          return text;
        }
      }
      return '';
    };
    
    return extractText(doc.body);
  }, []);

  return {
    suggestions,
    setSuggestions,
    selectedIndex,
    setSelectedIndex,
    suggestionPosition,
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
  };
};