"use client";

import MovementTable from "@/components/movement/table";
import ProductTable from "@/components/product/table";
import { Tab, Tabs } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home({
  searchParams,
}: Readonly<{
  searchParams: { tab?: string };
}>) {
  const router = useRouter();

  const [selected, setSelected] = useState<string>(
    searchParams?.tab ?? "movement"
  );

  const onChangeTab = (newValue: string) => {
    router.replace(`/?tab=${newValue}`);
    setSelected(newValue);
  };

  return (
    <main className="max-w-5xl mx-auto">
      <Tabs
        aria-label="Options"
        color="primary"
        className="flex justify-center my-10"
        selectedKey={selected}
        onSelectionChange={(newValue) => onChangeTab(newValue.toString())}
      >
        <Tab key="movement" title="Movimentações no Estoque">
          <MovementTable />
        </Tab>
        <Tab key="product" title="Produtos">
          <ProductTable />
        </Tab>
      </Tabs>
    </main>
  );
}
