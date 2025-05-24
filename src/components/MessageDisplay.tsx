import React from 'react';
import CopyButton from './CopyButton';

interface MessageDisplayProps {
  message: string;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const hasHTMLTags = (str: string) => {
    return /<[a-z][\s\S]*>/i.test(str);
  };

  const sanitizeHTML = (html: string) => {
    // Remove script tags and other potentially dangerous elements
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
               .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
               .replace(/javascript:/gi, '')
               .replace(/on\w+="[^"]*"/gi, '');
  };

  const renderMessageContent = () => {
    if (isValidJSON(message)) {
      // Display JSON in a formatted code block
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">
          {JSON.stringify(JSON.parse(message), null, 2)}
        </pre>
      );
    } else if (hasHTMLTags(message)) {
      // Render HTML content safely
      return (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: sanitizeHTML(message) 
          }} 
        />
      );
    } else {
      // Display plain text with preserved line breaks
      return (
        <div className="whitespace-pre-line">
          {message}
        </div>
      );
    }
  };

  return (
    <div className="mt-10 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-medium">Tu mensaje de prospección ✨</h2>
        <div className="ml-auto flex justify-end mb-4">
          <CopyButton message={message} />
        </div>
      </div>
      <div 
        className="p-6 rounded-lg font-sans font-medium overflow-auto"
        style={{ backgroundColor: '#1F1F1F' }}
      >
        {renderMessageContent()}
      </div>
    </div>
  );
}
