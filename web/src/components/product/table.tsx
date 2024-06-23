"use client";

import { useFetch } from "@/hooks/useFetch";
import { ProductsProps } from "@/types/product";
import {
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Key, useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../icon/search";

export default function ProductTable() {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data: products, isLoading } = useFetch<ProductsProps>(
    `/products?search=${filterValue}&page=${page}&pageSize=${rowsPerPage}`,
    {
      keepPreviousData: true,
    }
  );

  const loadingState = isLoading ? "loading" : "idle";

  const pages = useMemo(() => {
    return products?.items ? Math.ceil(products.items / rowsPerPage) : 0;
  }, [products?.items, rowsPerPage]);

  const renderCell = useCallback(
    (product: ProductsProps["data"][0], columnKey: Key) => {
      const cellValue = product[columnKey as keyof ProductsProps["data"][0]];

      switch (columnKey) {
        case "product":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{product.name}</p>
              <p className="text-bold text-tiny text-default-400">
                {product.description}
              </p>
            </div>
          );

        case "quantity":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{product.quantity}</p>
            </div>
          );

        case "alertLimit":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{product.alertLimit}</p>
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize"
              color={product.status ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {product.status ? "Ativo" : "Inativo"}
            </Chip>
          );

        default:
          return cellValue?.toString();
      }
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[30%]"
            placeholder="Buscar por nome"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onClear]);

  const bottomContent = useMemo(() => {
    if (pages > 0) {
      return (
        <div>
          <div className="flex justify-start items-center">
            <span className="text-default-400 text-small">
              Total de {products?.items} produtos
            </span>
          </div>
          <div className="py-2 px-2 flex justify-center items-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [products?.items, page, pages]);

  return (
    <Table
      aria-label="Table of products"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectionMode="none"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader
        columns={[
          { uid: "product", name: "Produto" },
          { uid: "quantity", name: "Quantidade" },
          { uid: "alertLimit", name: "Alerta de Limite" },
          { uid: "status", name: "Status" },
        ]}
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "product" ? "start" : "center"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent="Nenhum produto encontrado"
        items={products?.data ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
