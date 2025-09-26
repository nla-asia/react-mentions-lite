# React Mentions Lite

A lightweight, TypeScript-ready React mentions component with support for @ mentions and # hashtags. Features trigger-specific titles, input-relative positioning, external height constraints, and imperative input control.

## Features

- 🚀 Lightweight and performant
- 📝 TypeScript ready with full type definitions
- ⌨️ Keyboard navigation (Arrow keys, Tab, Enter, Escape)
- 🖱️ Click support for all suggestion items
- 🎨 Customizable styling with external height constraints
- 🔧 Configurable triggers (@ and # by default)
- 📱 Mobile friendly
- 🎯 Zero dependencies (except React)
- 📍 Configurable suggestion dropdown positioning
-  Portal rendering to avoid overflow clipping
- 🎯 Trigger-specific suggestion titles with natural stacking
- 🎛️ Input-relative positioning with offset control
- 🧹 Imperative input clearing via ref
- 🎯 Smart suggestion hiding when no matches found
- ♿ Full accessibility support with Tab navigation

## Installation

```bash
npm install react-mentions-lite
# or
yarn add react-mentions-lite
```

## Basic Usage

```tsx
import React from 'react';
import { ReactMentionsLite, MentionTriggerConfig } from 'react-mentions-lite';

const users = [
  { id: 1, display: 'John Doe', value: 'johndoe' },
  { id: 2, display: 'Jane Smith', value: 'janesmith' }
];

const tags = [
  { id: 1, display: 'react', value: 'react' },
  { id: 2, display: 'javascript', value: 'javascript' }
];

const triggers: MentionTriggerConfig[] = [
  {
    trigger: '@',
    data: users,
    suggestionTitle: 'Users'
  },
  {
    trigger: '#',
    data: tags,
    suggestionTitle: 'Tags'
  }
];

function App() {
  const handleContentChange = (content, plainText, mentions) => {
    console.log('HTML:', content);
    console.log('Plain text:', plainText);
    console.log('Mentions:', mentions);
  };

  return (
    <ReactMentionsLite
      placeholder="Type @ or # to mention..."
      triggers={triggers}
      onContentChange={handleContentChange}
      suggestionPosition="bottomCenter"
    />
  );
}
```

## Advanced Usage

### Input-Relative Positioning

```tsx
const triggers: MentionTriggerConfig[] = [
  {
    trigger: '@',
    data: users,
    suggestionTitle: 'Select a user'
  },
  {
    trigger: '#',
    data: channels,
    suggestionTitle: 'Choose a channel'
  }
];

<ReactMentionsLite
  triggers={triggers}
  suggestionPosition="inputTopLeft" // Position relative to input boundaries
  dropdownOffset={120} // Custom offset for input-relative positioning
  onContentChange={handleContentChange}
/>
```

### External Height Constraints

```tsx
<ReactMentionsLite
  triggers={triggers}
  suggestionStyle={{
    minHeight: '100px',
    maxHeight: '200px'
  }}
  onContentChange={handleContentChange}
/>
```

Apply external height constraints to the suggestion dropdown using the `suggestionStyle` prop. The dropdown will respect these constraints while maintaining proper scrolling and title positioning.

### Programmatic Input Clearing

```tsx
import React, { useRef } from 'react';
import { ReactMentionsLite, MentionsRef } from 'react-mentions-lite';

function ChatInput() {
  const mentionsRef = useRef<MentionsRef>(null);

  const handleSendMessage = async () => {
    // Send message logic...
    
    // Clear the input after successful send
    mentionsRef.current?.clear();
  };

  return (
    <ReactMentionsLite
      ref={mentionsRef}
      triggers={triggers}
      onContentChange={handleContentChange}
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `triggers` | `MentionTriggerConfig[]` | Required | Configuration for mention triggers |
| `placeholder` | `string` | `"Type to mention..."` | Placeholder text |
| `className` | `string` | `""` | CSS class for container |
| `style` | `CSSProperties` | `{}` | Inline styles for container |
| `onContentChange` | `function` | - | Callback when content changes |
| `maxSuggestions` | `number` | `10` | Maximum suggestions to show |
| `suggestionStyle` | `CSSProperties` | `{}` | Inline styles for suggestion dropdown |
| `suggestionClassName` | `string` | `""` | CSS class for suggestion dropdown |
| `disabled` | `boolean` | `false` | Disable the input |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `maxHeight` | `string\|number` | `"200px"` | Maximum height of editor |
| `minHeight` | `string\|number` | `"96px"` | Minimum height of editor |
| `onKeyDown` | `function` | - | Callback for keydown events |
| `suggestionPosition` | `SuggestionPosition` | `"bottomLeft"` | Position of suggestion dropdown |
| `dropdownOffset` | `number` | - | Offset for input-relative positioning (px) |
| `ref` | `React.Ref<MentionsRef>` | - | Ref for imperative methods |

### SuggestionPosition Options

- `"bottomLeft"` - Position below caret, aligned to left
- `"bottomRight"` - Position below caret, aligned to right  
- `"bottomCenter"` - Position below caret, centered horizontally
- `"topLeft"` - Position above caret, aligned to left
- `"topRight"` - Position above caret, aligned to right
- `"topCenter"` - Position above caret, centered horizontally
- `"inputTopLeft"` - Position above input, aligned to left
- `"inputTopRight"` - Position above input, aligned to right
- `"inputTopCenter"` - Position above input, centered horizontally
- `"inputBottomLeft"` - Position below input, aligned to left
- `"inputBottomRight"` - Position below input, aligned to right
- `"inputBottomCenter"` - Position below input, centered horizontally

### Types

```tsx
interface MentionItem {
  id: string | number;
  display: string;
  value: string;
  [key: string]: any;
}

interface MentionTriggerConfig {
  trigger: string;
  data: MentionItem[];
  className?: string;
  style?: React.CSSProperties;
  suggestionTitle?: string; // Title shown above suggestions for this trigger
}

interface MentionsRef {
  clear: () => void; // Clear the input content
}

type SuggestionPosition = 
  | 'topLeft' | 'topRight' | 'topCenter'
  | 'bottomLeft' | 'bottomRight' | 'bottomCenter'
  | 'inputTopLeft' | 'inputTopRight' | 'inputTopCenter'
  | 'inputBottomLeft' | 'inputBottomRight' | 'inputBottomCenter';
```

## License

MIT