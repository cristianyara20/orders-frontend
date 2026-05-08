"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/orderService";
import { getProducts } from "@/services/productService";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/Table";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          getOrders(),
          getProducts(),
        ]);
        setOrders(ordersRes.items || []);
        setProducts(productsRes.items || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  // Calculate metrics
  const totalSold = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const activeProducts = products.filter(p => !p.isDiscontinued).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-text-muted mt-2">Resumen general del sistema.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total Pedidos</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total Vendido</p>
              <p className="text-2xl font-bold">${totalSold.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Productos Activos</p>
              <p className="text-2xl font-bold">{activeProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Tendencia</p>
              <p className="text-2xl font-bold">+12%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader title="Últimos Pedidos" icon={ShoppingCart} />
        <CardContent className="p-0">
          <Table>
            <Thead>
              <Tr>
                <Th>No. Pedido</Th>
                <Th>Cliente</Th>
                <Th>Fecha</Th>
                <Th>Total</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentOrders.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center text-text-muted">No hay pedidos recientes.</Td>
                </Tr>
              ) : (
                recentOrders.map((order) => (
                  <Tr key={order.id} className="hover:bg-surface-hover transition-colors">
                    <Td className="font-medium">{order.orderNumber}</Td>
                    <Td>{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}</Td>
                    <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                    <Td className="font-semibold text-green-500">${order.totalAmount?.toFixed(2)}</Td>
                    <Td>
                      <Link href={`/orders/${order.id}`} className="text-primary hover:underline font-medium">
                        Ver detalle
                      </Link>
                    </Td>
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