"use client";

import { useEffect, useState } from "react";
import { getHealthStatus } from "@/services/systemService";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Activity, CheckCircle, XCircle, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Form";

export default function SystemStatus() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await getHealthStatus();
        setHealth(res);
      } catch (error) {
        setHealth({ status: "error", message: "Error checking API health" });
      } finally {
        setLoading(false);
      }
    };
    checkHealth();
  }, []);

  const API_DOCS_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "/api/v1/docs") 
    : "http://localhost:3000/api/v1/docs";
    
  const API_REDOC_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "/api/v1/redoc") 
    : "http://localhost:3000/api/v1/redoc";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Estado del Sistema
        </h1>
        <p className="text-text-muted mt-2">Verifica la conexión con la API y accede a la documentación.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Estado de la API" icon={Activity} />
          <CardContent className="flex flex-col items-center justify-center py-8">
            {loading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            ) : health?.status === "ok" ? (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-green-500">API Conectada</h2>
                <p className="text-text-muted mt-2">{health.message || "El servicio está funcionando correctamente."}</p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-red-500">Error de Conexión</h2>
                <p className="text-text-muted mt-2">{health?.message || "No se pudo conectar a la API."}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Documentación" icon={BookOpen} />
          <CardContent className="space-y-4">
            <p className="text-text-muted">
              La API REST proporciona endpoints para gestionar pedidos, clientes y productos.
              Puedes explorar y probar los endpoints interactivos utilizando las siguientes interfaces:
            </p>
            
            <div className="flex flex-col gap-3 mt-6">
              <Link href={API_DOCS_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full flex justify-between items-center" variant="primary">
                  <span>Swagger UI (Interactiva)</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link href={API_REDOC_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full flex justify-between items-center" variant="outline">
                  <span>ReDoc (Referencia)</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
