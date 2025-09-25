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
    if (!selection?.rangeCount || !editorRef.current) return null;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    
    return {
      top: rect.bottom - editorRect.top,
      left: rect.left - editorRect.left
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
      
      mentions.push({
        type,
        value,
        display,
        index
      });
    });
    
    return mentions;
  }, []);

  const getPlainText = useCallback((html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    let text = '';
    const walker = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_ALL
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.hasAttribute('data-mention-type')) {
          const type = element.getAttribute('data-mention-type');
          const value = element.getAttribute('data-mention-value');
          text += `${type}${value}`;
        }
      }
    }
    
    return text;
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