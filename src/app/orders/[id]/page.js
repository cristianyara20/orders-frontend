"use client";

import { useEffect, useState } from "react";
import { 
  getOrderById, 
  getOrderItems, 
  updateOrderItem, 
  deleteOrder, // Although we usually delete from list, it's good to have here
  updateOrder as updateOrderService 
} from "@/services/orderService";
import api from "@/services/api"; // For direct delete item if not in service
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/Table";
import { Button, Input } from "@/components/Form";
import { ArrowLeft, FileText, Package, User, Edit, Trash2, Check, X } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const [orderRes, itemsRes] = await Promise.all([
        getOrderById(id),
        getOrderItems(id),
      ]);
      setOrder(orderRes.data || orderRes);
      setItems(itemsRes.data || itemsRes);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await updateOrderItem(id, itemId, { quantity: parseInt(newQuantity) });
      setOrder(res.data || res);
      // Refresh items too
      const itemsRes = await getOrderItems(id);
      setItems(itemsRes.data || itemsRes);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Error al actualizar la cantidad.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (confirm("¿Estás seguro de eliminar este artículo del pedido?")) {
      try {
        await api.delete(`/orders/${id}/items/${itemId}`);
        // Refresh everything
        fetchOrderDetails();
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Error al eliminar el artículo.");
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido completo?")) {
      try {
        await deleteOrder(id);
        router.push("/orders");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Error al eliminar el pedido.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Pedido no encontrado</h2>
        <Button className="mt-4" onClick={() => router.push("/orders")}>
          Volver a Pedidos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/orders")} className="!px-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isEditing ? "Editando Pedido" : "Detalle del Pedido"}: {order.orderNumber}
            </h1>
            <p className="text-text-muted mt-1">
              Fecha: {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button variant="outline" className="!border-red-500 text-red-500 hover:bg-red-500/10" onClick={handleDeleteOrder}>
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(false)}>
              <Check className="w-4 h-4" />
              Finalizar Edición
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Información del Cliente" icon={User} />
          <CardContent className="space-y-4">
            {order.customer ? (
              <>
                <div>
                  <p className="text-sm text-text-muted">Nombre Completo</p>
                  <p className="font-medium text-lg">{order.customer.firstName} {order.customer.lastName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted">Ciudad</p>
                    <p className="font-medium">{order.customer.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">País</p>
                    <p className="font-medium">{order.customer.country}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-text-muted">Teléfono</p>
                    <p className="font-medium">{order.customer.phone || "N/A"}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-text-muted">Información de cliente no disponible.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Resumen" icon={FileText} />
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <p className="text-text-muted">Subtotal</p>
              <p className="font-medium">${order.totalAmount?.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <p className="text-text-muted">Impuestos / Envío</p>
              <p className="font-medium">$0.00</p>
            </div>
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <p>Total</p>
              <p className="text-green-500">${order.totalAmount?.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Artículos del Pedido" icon={Package} />
        <CardContent className="p-0">
          <Table>
            <Thead>
              <Tr>
                <Th>Producto</Th>
                <Th className="text-right">Precio Unit.</Th>
                <Th className="text-center">Cantidad</Th>
                <Th className="text-right">Subtotal</Th>
                {isEditing && <Th className="text-right">Acciones</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {items.length === 0 ? (
                <Tr>
                  <Td colSpan={isEditing ? 5 : 4} className="text-center py-8 text-text-muted">
                    No hay artículos en este pedido.
                  </Td>
                </Tr>
              ) : (
                items.map((item) => (
                  <Tr key={item.id}>
                    <Td className="font-medium text-text">
                      {item.product?.productName || `Producto #${item.productId}`}
                    </Td>
                    <Td className="text-right">${item.unitPrice?.toFixed(2)}</Td>
                    <Td className="text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            min="1" 
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                            className="w-16 px-2 py-1 bg-surface border border-border rounded text-center"
                          />
                        </div>
                      ) : (
                        item.quantity
                      )}
                    </Td>
                    <Td className="text-right font-semibold">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </Td>
                    {isEditing && (
                      <Td className="text-right">
                        <Button 
                          variant="outline" 
                          onClick={() => handleRemoveItem(item.id)}
                          className="!p-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

