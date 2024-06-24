"use client";

import { useFetch } from "@/hooks/useFetch";
import { useMutate } from "@/hooks/useMutate";
import { MovementsProps } from "@/types/movement";
import { ProductProps } from "@/types/product";
import FormatterUtil from "@/utils/formatter.util";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  ChipProps,
  Input,
  Pagination,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, "Muito curto.")
    .max(50, "Muito longo."),
  description: z
    .string()
    .min(1, "Muito curto.")
    .max(255, "Muito longo.")
    .optional(),
  alertLimit: z
    .number({ invalid_type_error: "Insira um número válido." })
    .int("Insira um valor inteiro.")
    .min(0, "Insira um valor maior ou igual a 0."),
  status: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function Product({
  searchParams,
}: Readonly<{
  searchParams: { tab?: string };
}>) {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      alertLimit: 0,
    },
  });

  const { data: product } = useFetch<ProductProps>(`/products/${params?.id}`, {
    revalidateOnFocus: false,
  });

  const updateProduct = useMutate("PATCH", `/products/${params?.id}`);

  const pages = Math.ceil((product?.movements?.length ?? 0) / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return product?.movements.slice(start, end);
  }, [page, product?.movements]);

  useEffect(() => {
    if (product) {
      const { name, description, alertLimit, status } = product;

      reset({
        name,
        description: description ?? undefined,
        alertLimit,
        status,
      });
    }
  }, [product, reset]);

  const renderCell = useCallback(
    (movement: ProductProps["movements"][0], columnKey: Key) => {
      const cellValue =
        movement[columnKey as keyof ProductProps["movements"][0]];

      const typeColorMap: Record<string, ChipProps["color"]> = {
        input: "success",
        output: "danger",
      };

      const typeTranslateMap: Record<string, string> = {
        input: "entrada",
        output: "saída",
      };

      switch (columnKey) {
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
    []
  );

  const bottomContent = useMemo(() => {
    if (pages > 0) {
      return (
        <div>
          <div className="flex justify-start items-center">
            <span className="text-default-400 text-small">
              Total de {product?.movements?.length} movimentações no estoque
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
  }, [page, pages, product?.movements?.length]);

  const onSubmit = async (formData: FormValues) => {
    const res = await updateProduct.mutateAsync(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Produto atualizado com sucesso.");
    }
  };

  return (
    <main className="max-w-5xl h-screen flex flex-col justify-center mx-auto">
      <Card>
        <CardHeader className="flex justify-center">
          <p className="font-bold text-lg">Atualizar Produto</p>
        </CardHeader>
        <CardBody>
          <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  variant="bordered"
                  color="primary"
                  label="Nome"
                  description="Insira um nome para o produto."
                  isRequired
                  value={value}
                  onValueChange={onChange}
                  isInvalid={!!errors?.name}
                  errorMessage={errors?.name?.message}
                />
              )}
            />

            <Spacer y={2} />

            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange, ...rest } }) => (
                <Textarea
                  {...rest}
                  variant="bordered"
                  color="primary"
                  rows={3}
                  label="Descrição"
                  description="Insira uma descrição para o produto."
                  value={value}
                  onValueChange={(newValue) =>
                    onChange(newValue === "" ? undefined : newValue)
                  }
                  isInvalid={!!errors?.description}
                  errorMessage={errors?.description?.message}
                />
              )}
            />

            <Spacer y={2} />

            <Controller
              control={control}
              name="alertLimit"
              render={({ field: { value, onChange, ...rest } }) => (
                <Input
                  {...rest}
                  variant="bordered"
                  color="primary"
                  label="Alerta de Limite"
                  description="Insira um valor para receber alertas de estoque baixo para este produto."
                  isRequired
                  value={value.toString()}
                  onValueChange={(newValue) => onChange(+newValue)}
                  isInvalid={!!errors?.alertLimit}
                  errorMessage={errors?.alertLimit?.message}
                />
              )}
            />

            <Spacer y={2} />

            <Controller
              control={control}
              name="status"
              render={({ field: { value, onChange, ...rest } }) => (
                <Checkbox {...rest} isSelected={value} onValueChange={onChange}>
                  Ativo
                </Checkbox>
              )}
            />

            <Spacer y={2} />

            <Accordion>
              <AccordionItem title="Movimentações">
                <Table
                  aria-label="Table to movements of product"
                  isHeaderSticky
                  bottomContent={bottomContent}
                  bottomContentPlacement="outside"
                  selectionMode="none"
                  removeWrapper
                >
                  <TableHeader
                    columns={[
                      { uid: "type", name: "Tipo de Movimentação" },
                      { uid: "quantity", name: "Quantidade" },
                      { uid: "createdAt", name: "Data" },
                    ]}
                  >
                    {(column) => (
                      <TableColumn key={column.uid} align="center">
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    emptyContent="Nenhuma movimentação encontrada"
                    items={items}
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
              </AccordionItem>
            </Accordion>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center gap-3">
          <Button
            color="danger"
            variant="light"
            isDisabled={updateProduct.isLoading}
            onPress={() =>
              router.replace(`/?tab=${searchParams?.tab ?? "product"}`)
            }
          >
            Voltar
          </Button>
          <Button
            type="submit"
            form="hook-form"
            color="success"
            isLoading={updateProduct.isLoading}
          >
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
