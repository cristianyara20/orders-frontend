"use client";

import { useEffect, useState } from "react";
import { getOrders, deleteOrder } from "@/services/orderService";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/Table";
import { Button, Input } from "@/components/Form";
import { ShoppingCart, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data || res);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Error al eliminar el pedido.");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase() : "";
    return (
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pedidos
          </h1>
          <p className="text-text-muted mt-2">Gestiona los pedidos de tus clientes.</p>
        </div>
        <Link href="/orders/create">
          <Button variant="primary">
            <Plus className="w-5 h-5" />
            Crear Pedido
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader 
          title="Listado de Pedidos" 
          icon={ShoppingCart} 
          action={
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar por cliente o No. pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-xl bg-surface focus:ring-2 focus:ring-primary/50 focus:outline-none focus:border-primary transition-colors text-sm w-64"
              />
            </div>
          }
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>No. Pedido</Th>
                  <Th>Cliente</Th>
                  <Th>Fecha</Th>
                  <Th>Total</Th>
                  <Th className="text-right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-8 text-text-muted">
                      No se encontraron pedidos.
                    </Td>
                  </Tr>
                ) : (
                  filteredOrders.map((order) => (
                    <Tr key={order.id} className="hover:bg-surface-hover/50">
                      <Td className="font-medium text-text">{order.orderNumber}</Td>
                      <Td>
                        {order.customer ? (
                          <div>
                            <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                            <p className="text-xs text-text-muted">{order.customer.city}, {order.customer.country}</p>
                          </div>
                        ) : (
                          <span className="text-text-muted italic">N/A</span>
                        )}
                      </Td>
                      <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                      <Td className="font-semibold text-green-500">${order.totalAmount?.toFixed(2)}</Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => router.push(`/orders/${order.id}`)}
                            className="!p-2"
                            title="Ver Detalle"
                          >
                            <Eye className="w-4 h-4 text-primary" />
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => router.push(`/orders/${order.id}?edit=true`)}
                            className="!p-2"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-orange-400" />
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleDelete(order.id)}
                            className="!p-2 hover:!border-red-500 group"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
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

