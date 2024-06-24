"use client";

import { useFetch } from "@/hooks/useFetch";
import { MovementsProps } from "@/types/movement";
import FormatterUtil from "@/utils/formatter.util";
import {
  Button,
  Chip,
  ChipProps,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Key, useCallback, useMemo, useState } from "react";
import { MovementAdd } from "./add";
import { useRouter } from "next/navigation";

export default function MovementTable() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const {
    data: movements,
    isLoading,
    mutate,
  } = useFetch<MovementsProps>(
    `/movements?page=${page}&pageSize=${rowsPerPage}`,
    {
      keepPreviousData: true,
    }
  );

  const loadingState = isLoading ? "loading" : "idle";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const pages = useMemo(() => {
    return movements?.items ? Math.ceil(movements.items / rowsPerPage) : 0;
  }, [movements?.items, rowsPerPage]);

  const renderCell = useCallback(
    (movement: MovementsProps["data"][0], columnKey: Key) => {
      const cellValue = movement[columnKey as keyof MovementsProps["data"][0]];

      const typeColorMap: Record<string, ChipProps["color"]> = {
        input: "success",
        output: "danger",
      };

      const typeTranslateMap: Record<string, string> = {
        input: "entrada",
        output: "saída",
      };

      switch (columnKey) {
        case "product":
          return (
            <div className="flex flex-col">
              <button
                className="w-fit h-fit m-0 p-0"
                onClick={() =>
                  router.push(`/products/${movement.products.id}?tab=movement`)
                }
              >
                <p className="text-left text-bold text-small cursor-pointer hover:text-primary hover:underline">
                  {movement.products.name}
                </p>
              </button>
            </div>
          );

        case "type":
          return (
            <Chip
              className="capitalize"
              color={typeColorMap[movement.type.toString().toLowerCase()]}
              size="sm"
              variant="flat"
            >
              {typeTranslateMap[movement.type.toString().toLowerCase()]}
            </Chip>
          );

        case "quantity":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{movement.quantity}</p>
            </div>
          );

        case "createdAt":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny text-default-400">
                {FormatterUtil.date(movement.createdAt, { timeStyle: "short" })}
              </p>
            </div>
          );

        default:
          return cellValue?.toString();
      }
    },
    [router]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-end">
        <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
          Adicionar Movimentação
        </Button>
      </div>
    );
  }, [onOpen]);

  const bottomContent = useMemo(() => {
    if (pages > 0) {
      return (
        <div>
          <div className="flex justify-start items-center">
            <span className="text-default-400 text-small">
              Total de {movements?.items} movimentações no estoque
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
  }, [movements?.items, page, pages]);

  return (
    <>
      <MovementAdd
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        mutate={mutate}
      />

      <Table
        aria-label="Table to movements of products"
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
            { uid: "type", name: "Tipo de Movimentação" },
            { uid: "quantity", name: "Quantidade" },
            { uid: "createdAt", name: "Data" },
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
          emptyContent="Nenhuma movimentação encontrada"
          items={movements?.data ?? []}
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
    </>
  );
}
