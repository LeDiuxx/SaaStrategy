
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutreachResponse {
  mensaje: string;
}

export default function ProspectionForm() {
  const [formData, setFormData] = useState({
    empresa_url: '',
    linkedin_url: '',
    canal: 'Correo'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.empresa_url || !formData.linkedin_url) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setFormSubmitted(false);
    
    try {
      const webhookUrl = 'https://donwea01.app.n8n.cloud/webhook-test/saastrategy';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as OutreachResponse;
      
      if (!data.mensaje) {
        throw new Error('La respuesta no contiene un mensaje válido');
      }

      // Set message and update UI state
      setMessage(data.mensaje);
      setFormSubmitted(true);
      
      toast({
        title: "¡Mensaje generado!",
        description: "Tu mensaje de prospección ha sido creado exitosamente."
      });
    } catch (error) {
      console.error('Error al enviar datos:', error);
      toast({
        title: "Error al procesar",
        description: error instanceof Error ? error.message : "No se pudo generar el mensaje. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, canal: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-medium mb-2 text-center">Diseñemos el próximo contacto en frío ❄️</h1>
      <p className="text-muted-foreground mb-8 text-center">Completa el formulario para generar un mensaje hiperpersonalizado</p>
      
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <Label htmlFor="empresa_url">Ingresa el sitio web de tu empresa</Label>
          <Input
            id="empresa_url"
            name="empresa_url"
            placeholder="https://miempresa.com"
            value={formData.empresa_url}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="bg-secondary/50 border-secondary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">Ingresa la URL del perfil de LinkedIn a prospectar</Label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            placeholder="https://linkedin.com/in/prospecto"
            value={formData.linkedin_url}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="bg-secondary/50 border-secondary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="canal">Elige el canal que utilizarás para tu prospección</Label>
          <Select
            value={formData.canal}
            onValueChange={handleSelectChange}
            disabled={isLoading}
          >
            <SelectTrigger id="canal" className="bg-secondary/50 border-secondary">
              <SelectValue placeholder="Selecciona un canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Correo">Correo</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="LinkedIn DM">LinkedIn DM</SelectItem>
              <SelectItem value="Llamada">Llamada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full max-w-xs"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando tu mensaje en frío... 🧊
              </span>
            ) : (
              <span className="flex items-center">
                Generar mensaje
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
      
      {formSubmitted && message && (
        <div className="mt-10 w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-medium">Tu mensaje de prospección ✨</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMessage}
              className="flex items-center"
            >
              <Copy className="mr-2 h-4 w-4" />
              📋 Copiar mensaje
            </Button>
          </div>
          <div 
            className="p-6 rounded-lg font-sans font-medium overflow-auto"
            style={{ backgroundColor: '#1F1F1F' }}
          >
            {renderMessageContent()}
          </div>
        </div>
      )}
    </div>
  );
}
