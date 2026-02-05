
import React, { useState } from 'react';

interface CodeSnippetProps {
  code: string;
  language: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group bg-slate-900 rounded-lg overflow-hidden border border-slate-700 mt-4">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 text-xs text-slate-400 border-b border-slate-700">
        <span className="uppercase">{language}</span>
        <button 
          onClick={copy}
          className="hover:text-white transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto mono text-sm leading-relaxed text-blue-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};
