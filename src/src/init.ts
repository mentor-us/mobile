import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: __DEV__ ? 0 : 3, // retry 3 times
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});
