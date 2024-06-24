import { api } from "@/services/api";
import useSWR from "swr";
import { BareFetcher, PublicConfiguration } from "swr/_internal";

export function useFetch<Data = unknown, Error = unknown>(
  url: string,
  swr?: Partial<PublicConfiguration<Data, Error, BareFetcher<Data>>> | undefined
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Data, Error>(
    () => url,
    async (url) => {
      const response = await api.get(url);

      return response.data;
    },
    swr
  );

  return { data, error, isLoading, isValidating, mutate };
}
