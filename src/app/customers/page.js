"use client";

import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/Table";
import { Button } from "@/components/Form";
import { Users, Plus, Edit } from "lucide-react";
import Link from "next/link";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomers();
        setCustomers(res.items || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-text-muted mt-2">Administra el listado de clientes.</p>
        </div>
        <Link href="/customers/create">
          <Button variant="primary">
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader title="Listado" icon={Users} />
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
                  <Th>Nombre</Th>
                  <Th>Ciudad</Th>
                  <Th>País</Th>
                  <Th>Teléfono</Th>
                  <Th className="text-right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {customers.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} className="text-center py-8 text-text-muted">
                      No hay clientes registrados.
                    </Td>
                  </Tr>
                ) : (
                  customers.map((customer) => (
                    <Tr key={customer.id}>
                      <Td className="text-text-muted">#{customer.id}</Td>
                      <Td className="font-medium text-text">{customer.firstName} {customer.lastName}</Td>
                      <Td>{customer.city}</Td>
                      <Td>{customer.country}</Td>
                      <Td>{customer.phone || "N/A"}</Td>
                      <Td className="text-right">
                        <Button variant="outline" className="!p-2 inline-block">
                          <Edit className="w-4 h-4 text-text-muted hover:text-primary" />
                        </Button>
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