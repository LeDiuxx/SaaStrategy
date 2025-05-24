
import React, { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import ProspectionFormFields from './ProspectionFormFields';
import MessageDisplay from './MessageDisplay';

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
      
      <ProspectionFormFields
        formData={formData}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
      />
      
      {formSubmitted && message && (
        <MessageDisplay message={message} />
      )}
    </div>
  );
}
