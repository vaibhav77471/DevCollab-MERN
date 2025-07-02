import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark'; // Optional: Theme

const CodeEditor = ({ code, onCodeChange }) => {
  return (
    <div className="mt-4">
      <CodeMirror
        value={code}
        height="500px"
        extensions={[javascript()]}
        theme={oneDark}
        onChange={(value) => onCodeChange(value)}
      />
    </div>
  );
};

export default CodeEditor;
