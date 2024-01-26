import { useFocusEffect } from "@react-navigation/core";
import { useCallback } from "react";
import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";

export function useReactNavigationQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const isFocused = useIsFocused();
  const useQueryReturn = useQuery(queryKey, queryFn, {
    ...options,
    enabled: options?.enabled && isFocused,
  });

  useFocusEffect(
    useCallback(() => {
      if (
        ((options?.refetchOnWindowFocus && useQueryReturn.isStale) ||
          options?.refetchOnWindowFocus === "always") &&
        options.enabled !== false
      )
        useQueryReturn.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options?.enabled, options?.refetchOnWindowFocus]),
  );

  return useQueryReturn;
}
