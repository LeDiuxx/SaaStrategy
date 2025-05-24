
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface FormData {
  empresa_url: string;
  linkedin_url: string;
  canal: string;
}

interface ProspectionFormFieldsProps {
  formData: FormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProspectionFormFields({
  formData,
  isLoading,
  onInputChange,
  onSelectChange,
  onSubmit
}: ProspectionFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="empresa_url">Ingresa el sitio web de tu empresa</Label>
        <Input
          id="empresa_url"
          name="empresa_url"
          placeholder="https://miempresa.com"
          value={formData.empresa_url}
          onChange={onInputChange}
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
          onChange={onInputChange}
          disabled={isLoading}
          required
          className="bg-secondary/50 border-secondary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="canal">Elige el canal que utilizarás para tu prospección</Label>
        <Select
          value={formData.canal}
          onValueChange={onSelectChange}
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
  );
}
