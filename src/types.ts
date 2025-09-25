export interface MentionItem {
  id: string | number;
  display: string;
  value: string;
  [key: string]: any;
}

export interface MentionTriggerConfig {
  trigger: string;
  data: MentionItem[];
  className?: string;
  style?: React.CSSProperties;
}

export interface MentionPosition {
  top: number;
  left: number;
}

export type SuggestionPosition = 
  | 'topLeft' | 'topRight' | 'topCenter'
  | 'bottomLeft' | 'bottomRight' | 'bottomCenter';

export interface MentionsProps {
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  triggers: MentionTriggerConfig[];
  onContentChange?: (content: string, plainText: string, mentions: ParsedMention[]) => void;
  maxSuggestions?: number;
  suggestionStyle?: React.CSSProperties;
  suggestionClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxHeight?: string | number;
  minHeight?: string | number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  suggestionPosition?: SuggestionPosition;
}

export interface ParsedMention {
  type: string;
  value: string;
  display: string;
  index: number;
}

export interface SuggestionListProps {
  suggestions: MentionItem[];
  selectedIndex: number;
  onSelect: (suggestion: MentionItem) => void;
  position: MentionPosition;
  suggestionPosition?: SuggestionPosition;
  className?: string;
  style?: React.CSSProperties;
  maxHeight?: string | number;
}