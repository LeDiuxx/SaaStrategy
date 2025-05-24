
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CopyButtonProps {
  message: string;
}

export default function CopyButton({ message }: CopyButtonProps) {
  const hasHTMLTags = (str: string) => {
    return /<[a-z][\s\S]*>/i.test(str);
  };

  const hasTable = (str: string) => {
    return /<table[\s\S]*>[\s\S]*<\/table>/i.test(str);
  };

  const handleCopy = () => {
    try {
      if (hasTable(message)) {
        // Copy as TSV for tables
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = message;
        
        const table = tempDiv.querySelector('table');
        
        if (!table) {
          toast({
            title: "No se encontró tabla",
            description: "El mensaje no contiene una tabla para copiar.",
            variant: "destructive"
          });
          return;
        }

        const rows = table.querySelectorAll('tr');
        const tsvData: string[] = [];

        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          const rowData: string[] = [];
          
          cells.forEach(cell => {
            const cellText = cell.textContent?.trim() || '';
            const cleanText = cellText.replace(/\t/g, ' ').replace(/\n/g, ' ');
            rowData.push(cleanText);
          });
          
          tsvData.push(rowData.join('\t'));
        });

        const tsvString = tsvData.join('\n');
        navigator.clipboard.writeText(tsvString);
        
        toast({
          title: "Tabla copiada",
          description: "La tabla ha sido copiada al portapapeles en formato TSV."
        });
      } else {
        // Copy as plain text
        const textContent = hasHTMLTags(message) 
          ? new DOMParser().parseFromString(message, 'text/html').body.textContent || message
          : message;
        
        navigator.clipboard.writeText(textContent);
        toast({
          title: "Copiado al portapapeles",
          description: "El mensaje ha sido copiado correctamente."
        });
      }
    } catch (error) {
      console.error('Error copying content:', error);
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el contenido. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center"
    >
      <Clipboard className="mr-2 h-4 w-4" />
      📋 Copiar
    </Button>
  );
}
