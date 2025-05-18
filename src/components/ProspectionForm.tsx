
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
      // Updated webhook URL as requested
      const webhookUrl = 'https://donwea01.app.n8n.cloud/webhook-test/saastrategy';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // For demo/testing, simulate a response with dummy data
      // In a real app, replace this with the actual response processing
      // const data = await response.json() as OutreachResponse;
      
      // Simulated response for demo purposes
      const simulatedData = {
        mensaje: `Hola [nombre],\n\nEspero que estés teniendo un excelente día. Mi nombre es Juan y trabajo en el departamento de ventas de ${new URL(formData.empresa_url).hostname.replace('www.', '').split('.')[0]}.\n\nHe estado siguiendo tu perfil en LinkedIn y me ha llamado la atención tu experiencia en [industria]. Creo que podríamos ayudarte a incrementar tus resultados de [área relevante] con nuestra solución.\n\n¿Tendríamos unos minutos esta semana para ver si podemos ayudarte?\n\nSaludos cordiales,\nJuan`
      };

      // Set message and update UI state
      setMessage(simulatedData.mensaje);
      setFormSubmitted(true);
      
      toast({
        title: "¡Mensaje generado!",
        description: "Tu mensaje de prospección ha sido creado exitosamente."
      });
    } catch (error) {
      console.error('Error al enviar datos:', error);
      toast({
        title: "Error al procesar",
        description: "No se pudo generar el mensaje. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copiado al portapapeles",
      description: "El mensaje ha sido copiado correctamente."
    });
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
              Copiar mensaje
            </Button>
          </div>
          <div className="bg-form-output p-6 rounded-lg whitespace-pre-line">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
