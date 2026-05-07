"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Button, Input, Select } from "@/components/Form";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createOrder, getProducts } from "@/services/orderService";

const mockCustomers = [
  { id: 1, name: "Carlos Ramírez" },
  { id: 2, name: "María González" },
  { id: 3, name: "Diego Fernández" },
  { id: 4, name: "Ana Torres" }
];

export default function CreateOrder() {
  const router = useRouter();
  
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleAddItem = () => {
    if (!productId || quantity < 1) return;
    
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    const existingIndex = items.findIndex(item => item.productId === parseInt(productId));
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += parseInt(quantity);
      setItems(newItems);
    } else {
      setItems([
        ...items, 
        { 
          productId: parseInt(productId), 
          quantity: parseInt(quantity), 
          productName: product.productName, 
          unitPrice: product.unitPrice 
        }
      ]);
    }
    
    setProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveOrder = async () => {
    if (!customerId || items.length === 0) {
      alert("Por favor seleccione un cliente y agregue al menos un artículo.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderData = {
        customerId: parseInt(customerId),
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      
      await createOrder(orderData);
      router.push("/orders");
      router.refresh();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error al crear el pedido. Verifique que el servidor esté activo.");
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
            Crear Pedido
          </h1>
          <p className="text-text-muted mt-1">Registra un nuevo pedido en el sistema.</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Información del Pedido" icon={Plus} />
        <CardContent className="space-y-4 max-w-2xl">
          <Select label="Cliente" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Seleccione un cliente...</option>
            {mockCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>

          <div className="pt-4 pb-2 border-b border-border">
            <h3 className="font-semibold text-lg">Artículos</h3>
          </div>

          {items.length > 0 && (
            <div className="space-y-2 mb-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-surface-hover p-3 rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-text">{item.productName}</p>
                    <p className="text-sm text-text-muted">
                      Cantidad: {item.quantity} | Precio: ${item.unitPrice.toFixed(2)} | Subtotal: ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleRemoveItem(index)} className="!p-2 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 items-end">
            <Select label="Producto" className="flex-1" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Seleccione un producto...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.productName} (${p.unitPrice})</option>
              ))}
            </Select>
            <Input label="Cantidad" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={1} className="w-24" />
            <Button variant="secondary" type="button" onClick={handleAddItem}>Añadir</Button>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-border mt-6">
            <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveOrder} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Pedido"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
