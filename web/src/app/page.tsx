"use client";

import MovementTable from "@/components/movement/table";
import { Tab, Tabs } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto">
      <Tabs aria-label="Options" color="primary" disabledKeys={["product"]} className="flex justify-center my-10">
        <Tab key="movement" title="Movimentações no Estoque">
          <MovementTable />
        </Tab>
        <Tab key="product" title="Produtos"></Tab>
      </Tabs>
    </main>
  );
}
