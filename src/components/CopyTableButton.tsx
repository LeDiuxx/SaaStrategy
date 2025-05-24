
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CopyTableButtonProps {
  message: string;
}

export default function CopyTableButton({ message }: CopyTableButtonProps) {
  const handleCopyAsExcel = () => {
    try {
      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = message;
      
      // Find the table element
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
          // Extract text content and clean it
          const cellText = cell.textContent?.trim() || '';
          // Escape tabs and newlines in cell content
          const cleanText = cellText.replace(/\t/g, ' ').replace(/\n/g, ' ');
          rowData.push(cleanText);
        });
        
        // Join cells with tabs
        tsvData.push(rowData.join('\t'));
      });

      // Join rows with newlines
      const tsvString = tsvData.join('\n');
      
      // Copy to clipboard
      navigator.clipboard.writeText(tsvString);
      
      toast({
        title: "Tabla copiada",
        description: "La tabla ha sido copiada al portapapeles en formato TSV."
      });
    } catch (error) {
      console.error('Error copying table:', error);
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar la tabla. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopyAsExcel}
      className="flex items-center"
    >
      <Clipboard className="mr-2 h-4 w-4" />
      📋 Copiar tabla
    </Button>
  );
}
