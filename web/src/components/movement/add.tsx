"use client";

import { useFetch } from "@/hooks/useFetch";
import { useMutate } from "@/hooks/useMutate";
import { MovementsProps } from "@/types/movement";
import { ProductsProps } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { z } from "zod";

const listType: readonly [string, ...string[]] = ["INPUT", "OUTPUT"];

const schema = z.object({
  type: z.enum(listType),
  productId: z.number().int(),
  quantity: z
    .number({
      required_error: "Campo obrigatório.",
      invalid_type_error: "Insira um número válido.",
    })
    .int("Insira um valor inteiro.")
    .min(1, "Insira um valor maior que 0."),
});

type FormValues = z.infer<typeof schema>;

type MovementAddProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  mutate: KeyedMutator<MovementsProps>;
};

export function MovementAdd({
  isOpen,
  onOpenChange,
  mutate,
}: MovementAddProps) {
  const [filterValue, setFilterValue] = useState<string>("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const { data: products, isLoading } = useFetch<ProductsProps>(
    `/products?search=${filterValue}&page=1&pageSize=10`,
    {
      keepPreviousData: true,
    }
  );

  const createMovement = useMutate("POST", "/movements");

  const onClose = () => {
    onOpenChange();
    reset();
  };

  const onSubmit = async (formData: FormValues) => {
    const res = await createMovement.mutateAsync(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      mutate();

      onClose();

      toast.success("Movimentação do produto foi criada com sucesso.");
    }
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="mx-auto">
              <p className="font-bold text-lg">
                Adicionar Movimentação de Produto
              </p>
            </ModalHeader>
            <ModalBody>
              <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <Select
                      {...rest}
                      label="Tipo de Movimentação"
                      variant="bordered"
                      color="primary"
                      isRequired
                      disallowEmptySelection
                      selectedKeys={[value]}
                      onSelectionChange={(keys) => {
                        const newValue = Array.from(keys)[0];
                        onChange(newValue);
                      }}
                    >
                      <SelectItem key="INPUT" value="INPUT">
                        Entrada
                      </SelectItem>
                      <SelectItem key="OUTPUT" value="OUTPUT">
                        Saída
                      </SelectItem>
                    </Select>
                  )}
                />

                <Spacer y={2} />

                <Controller
                  control={control}
                  name="productId"
                  render={({ field: { onChange, ...rest } }) => (
                    <Autocomplete
                      {...rest}
                      color="primary"
                      variant="bordered"
                      label="Produto"
                      isRequired
                      items={products?.data ?? []}
                      isLoading={isLoading}
                      inputValue={filterValue}
                      onInputChange={setFilterValue}
                      onSelectionChange={(key) => {
                        const newValue = key ? +key : undefined;
                        onChange(newValue);
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id.toString()}>
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />

                <Spacer y={2} />

                <Input
                  type="number"
                  variant="bordered"
                  color="primary"
                  label="Quantidade"
                  description="Insira a quantidade do produto."
                  isRequired
                  {...register("quantity", {
                    setValueAs: (value) => (value === "" ? undefined : +value),
                  })}
                  isInvalid={!!errors?.quantity}
                  errorMessage={errors?.quantity?.message}
                />
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <Button
                color="danger"
                variant="light"
                isDisabled={createMovement.isLoading}
                onPress={onClose}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                form="hook-form"
                color="success"
                isLoading={createMovement.isLoading}
              >
                Salvar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
