import { useRouter } from "next/navigation";
import { useState } from "react";

import { AxiosRequestConfig } from "axios";

import { api } from "../services/api";

export function useMutate(
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  url: string
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutateAsync = async (
    data?: object | FormData,
    config?: AxiosRequestConfig<object>
  ) => {
    setIsLoading(true);

    return await api({
      method,
      url,
      data,
      ...config,
    })
      .then((res) => {
        setIsLoading(false);

        return {
          success: res?.data,
          error: undefined,
        };
      })
      .catch((err) => {
        setIsLoading(false);

        let message = err?.response?.data?.message;
        if (typeof message !== "string") {
          message = "Algo deu errado!";
        }

        return {
          success: undefined,
          error: message,
        };
      });
  };

  return { mutateAsync, isLoading };
}