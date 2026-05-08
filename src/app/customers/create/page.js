"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Button, Input } from "@/components/Form";
import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/services/customerService";

export default function CreateCustomer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCustomer = async () => {
    if (!formData.firstName || !formData.lastName) {
      alert("Por favor complete al menos nombre y apellido.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCustomer(formData);
      router.push("/customers");
      router.refresh();
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Error al crear el cliente. Verifique que el servidor esté activo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="!px-3">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Crear Cliente
          </h1>
          <p className="text-text-muted mt-1">Registra un nuevo cliente en el sistema.</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Información del Cliente" icon={Plus} />
        <CardContent className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nombre" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              placeholder="Ej. Juan"
            />
            <Input 
              label="Apellido" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              placeholder="Ej. Pérez"
            />
            <Input 
              label="Ciudad" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              placeholder="Ej. Madrid"
            />
            <Input 
              label="País" 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              placeholder="Ej. España"
            />
            <Input 
              label="Teléfono" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="Ej. +34 600 000 000"
              className="md:col-span-2"
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-border mt-6">
            <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveCustomer} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
