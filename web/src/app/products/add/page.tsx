"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spacer,
  Textarea,
} from "@nextui-org/react";
import { z } from "zod";
import { useMutate } from "@/hooks/useMutate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
});

type FormValues = z.infer<typeof schema>;

export default function ProductAdd() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      alertLimit: 0,
    },
  });

  const createProduct = useMutate("POST", "/products");

  const onSubmit = async (formData: FormValues) => {
    const res = await createProduct.mutateAsync(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      const productId = res.success.id;

      router.push(`/products/${productId}`);

      toast.success("Produto criado com sucesso.");
    }
  };

  return (
    <main className="max-w-5xl h-screen flex flex-col justify-center mx-auto">
      <Card>
        <CardHeader className="flex justify-center">
          <p className="font-bold text-lg">Novo Produto</p>
        </CardHeader>
        <CardBody>
          <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
            <Input
              variant="bordered"
              color="primary"
              label="Nome"
              description="Insira um nome para o produto."
              isRequired
              {...register("name")}
              isInvalid={!!errors?.name}
              errorMessage={errors?.name?.message}
            />

            <Spacer y={2} />

            <Textarea
              variant="bordered"
              color="primary"
              rows={3}
              label="Descrição"
              description="Insira uma descrição para o produto."
              {...register("description", {
                setValueAs: (value) => (value === "" ? undefined : value),
              })}
              isInvalid={!!errors?.description}
              errorMessage={errors?.description?.message}
            />

            <Spacer y={2} />

            <Input
              variant="bordered"
              color="primary"
              label="Alerta de Limite"
              description="Insira um valor para receber alertas de estoque baixo para este produto."
              isRequired
              {...register("alertLimit", { valueAsNumber: true })}
              isInvalid={!!errors?.alertLimit}
              errorMessage={errors?.alertLimit?.message}
            />
          </form>
        </CardBody>
        <CardFooter className="flex justify-center gap-3">
          <Button
            color="danger"
            variant="light"
            isDisabled={createProduct.isLoading}
            onPress={() => router.replace("/?tab=product")}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            form="hook-form"
            color="success"
            isLoading={createProduct.isLoading}
          >
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
