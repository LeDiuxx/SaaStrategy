
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CopyMessageButtonProps {
  message: string;
}

export default function CopyMessageButton({ message }: CopyMessageButtonProps) {
  const hasHTMLTags = (str: string) => {
    return /<[a-z][\s\S]*>/i.test(str);
  };

  const handleCopyMessage = () => {
    // For HTML content, copy the text content without tags
    const textContent = hasHTMLTags(message) 
      ? new DOMParser().parseFromString(message, 'text/html').body.textContent || message
      : message;
    
    navigator.clipboard.writeText(textContent);
    toast({
      title: "Copiado al portapapeles",
      description: "El mensaje ha sido copiado correctamente."
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopyMessage}
      className="flex items-center"
    >
      <Clipboard className="mr-2 h-4 w-4" />
      📋 Copiar mensaje
    </Button>
  );
}
