"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/Table";
import { Button, Input } from "@/components/Form";
import { Package, Plus, Edit, Trash2 } from "lucide-react";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the local form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ productName: "", unitPrice: "", package: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data || res);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.unitPrice) {
      alert("Por favor ingrese el nombre y precio del producto.");
      return;
    }
    
    // Simulate backend response locally
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const addedProduct = {
      id: nextId,
      productName: newProduct.productName,
      unitPrice: parseFloat(newProduct.unitPrice),
      package: newProduct.package || "N/A",
      isDiscontinued: false
    };
    
    setProducts([addedProduct, ...products]);
    setNewProduct({ productName: "", unitPrice: "", package: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Productos
          </h1>
          <p className="text-text-muted mt-2">Administra el catálogo de productos.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-5 h-5" />
          {showAddForm ? "Cancelar Formulario" : "Nuevo Producto"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-primary/50 shadow-md">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Agregar Nuevo Producto (Solo Local)</h3>
            <div className="flex gap-4 items-end">
              <Input 
                label="Nombre del Producto" 
                className="flex-1" 
                value={newProduct.productName} 
                onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})} 
                placeholder="Ej. Teclado Mecánico"
              />
              <Input 
                label="Precio" 
                type="number" 
                className="w-32" 
                value={newProduct.unitPrice} 
                onChange={(e) => setNewProduct({...newProduct, unitPrice: e.target.value})} 
                placeholder="0.00"
                min={0}
              />
              <Input 
                label="Paquete" 
                className="w-48" 
                value={newProduct.package} 
                onChange={(e) => setNewProduct({...newProduct, package: e.target.value})} 
                placeholder="Ej. Caja x 1"
              />
              <Button variant="primary" onClick={handleAddProduct}>Guardar</Button>
            </div>
            <p className="text-xs text-text-muted italic">* El producto se agregará temporalmente a la tabla sin modificar el backend real.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title="Catálogo" icon={Package} />
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Nombre del Producto</Th>
                  <Th>Precio</Th>
                  <Th>Paquete</Th>
                  <Th>Estado</Th>
                  <Th className="text-right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} className="text-center py-8 text-text-muted">
                      No hay productos registrados.
                    </Td>
                  </Tr>
                ) : (
                  products.map((product) => (
                    <Tr key={product.id}>
                      <Td className="text-text-muted">#{product.id}</Td>
                      <Td className="font-medium text-text">{product.productName}</Td>
                      <Td className="font-semibold text-green-500">${product.unitPrice?.toFixed(2)}</Td>
                      <Td>{product.package}</Td>
                      <Td>
                        {product.isDiscontinued ? (
                          <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold">
                            Discontinuado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold">
                            Activo
                          </span>
                        )}
                      </Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" className="!p-2">
                            <Edit className="w-4 h-4 text-text-muted hover:text-primary" />
                          </Button>
                          <Button variant="outline" className="!p-2 hover:!border-red-500 hover:!text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
