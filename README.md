# React Mentions Lite

A lightweight, TypeScript-ready React mentions component with support for @ mentions and # hashtags.

## Features

- 🚀 Lightweight and performant
- 📝 TypeScript ready with full type definitions
- ⌨️ Keyboard navigation (Arrow keys, Tab, Enter, Escape)
- 🎨 Customizable styling
- 🔧 Configurable triggers (@ and # by default)
- 📱 Mobile friendly
- 🎯 Zero dependencies (except React)
- 📍 Configurable suggestion dropdown positioning
- 🖱️ Click support for suggestions
- 🔒 Portal rendering to avoid overflow clipping

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
    data: users
  },
  {
    trigger: '#',
    data: tags
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

### Custom Positioning

```tsx
<ReactMentionsLite
  triggers={triggers}
  suggestionPosition="topRight" // Position above and aligned to right
  onContentChange={handleContentChange}
/>
```

### External KeyDown Handling

```tsx
<ReactMentionsLite
  triggers={triggers}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Handle form submission
      handleSubmit();
    }
  }}
  onContentChange={handleContentChange}
/>
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
| `disabled` | `boolean` | `false` | Disable the input |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `maxHeight` | `string\|number` | `"200px"` | Maximum height of editor |
| `minHeight` | `string\|number` | `"96px"` | Minimum height of editor |
| `onKeyDown` | `function` | - | Callback for keydown events |
| `suggestionPosition` | `SuggestionPosition` | `"bottomLeft"` | Position of suggestion dropdown |

### SuggestionPosition Options

- `"bottomLeft"` - Position below caret, aligned to left
- `"bottomRight"` - Position below caret, aligned to right  
- `"bottomCenter"` - Position below caret, centered horizontally
- `"topLeft"` - Position above caret, aligned to left
- `"topRight"` - Position above caret, aligned to right
- `"topCenter"` - Position above caret, centered horizontally

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
}

type SuggestionPosition = 
  | 'topLeft' | 'topRight' | 'topCenter'
  | 'bottomLeft' | 'bottomRight' | 'bottomCenter';
```

## License

MIT