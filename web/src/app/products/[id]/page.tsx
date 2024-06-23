"use client";

import { useFetch } from "@/hooks/useFetch";
import { useMutate } from "@/hooks/useMutate";
import { ProductProps } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Spacer,
  Textarea,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
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
