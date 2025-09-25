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
| `disabled` | `boolean` | `false` | Disable the input |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `maxHeight` | `string\|number` | `"200px"` | Maximum height of editor |
| `minHeight` | `string\|number` | `"96px"` | Minimum height of editor |

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
```

## License

MIT