"use client";

import React, { useEffect, useRef } from "react";
import { IgrGridModule, IgrGrid, IgrColumn } from 'igniteui-react-grids';
import 'igniteui-react-grids/grids/themes/light/bootstrap.css';

export default function DashboardGrid({ data }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      IgrGridModule.register();
    }
  }, []);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <IgrGrid
        height="100%"
        width="100%"
        data={data}
        autoGenerate={false}
      >
        <IgrColumn field="orderNumber" header="No. Pedido" />
        <IgrColumn field="customerName" header="Cliente" />
        <IgrColumn field="orderDate" header="Fecha" dataType="date" />
        <IgrColumn field="totalAmount" header="Total" dataType="currency" />
      </IgrGrid>
    </div>
  );
}
