"use client";

import { useFetch } from "@/hooks/useFetch";
import { ProductsProps } from "@/types/product";
import {
  Button,
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
  Tooltip,
} from "@nextui-org/react";
import { Key, useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../icon/search";
import { PlusIcon } from "@radix-ui/react-icons";
import { WarningIcon } from "../icon/warning";
import { EyeIcon } from "../icon/eye";
import { useRouter } from "next/navigation";

export default function ProductTable() {
  const router = useRouter();

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
          const isShowAlertLimit =
            product.quantity <= product.alertLimit && product.status;

          return isShowAlertLimit ? (
            <Tooltip
              color="warning"
              content="O produto está na zona de alerta."
              showArrow
            >
              <span className="flex justify-center text-warning">
                <WarningIcon />
              </span>
            </Tooltip>
          ) : null;

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

        case "actions":
          return (
            <Tooltip color="default" content="Detalhes" showArrow>
              <Button
                aria-label="details"
                variant="light"
                color="default"
                size="sm"
                isIconOnly
                onPress={() => router.push(`/products/${product.id}`)}
              >
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Button>
            </Tooltip>
          );

        default:
          return cellValue?.toString();
      }
    },
    [router]
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
      <div className="flex justify-between">
        <Input
          isClearable
          className="w-full sm:max-w-[30%]"
          placeholder="Buscar por nome"
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />

        <Button
          color="primary"
          endContent={<PlusIcon />}
          onPress={() => router.push("/products/add")}
        >
          Adicionar Produto
        </Button>
      </div>
    );
  }, [filterValue, onSearchChange, onClear, router]);

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
          { uid: "actions", name: "" },
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
