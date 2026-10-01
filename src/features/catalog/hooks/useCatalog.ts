import { useQuery } from '@tanstack/react-query';

import { catalogApi } from '../data/catalogApi';

export const catalogKeys = {
  all: ['catalog'] as const,
  home: () => [...catalogKeys.all, 'home'] as const,
  detail: (productId: string) => [...catalogKeys.all, 'detail', productId] as const,
};

export const useHomeCatalog = () =>
  useQuery({ queryKey: catalogKeys.home(), queryFn: catalogApi.getHome, staleTime: Infinity });

export const useProduct = (productId: string) =>
  useQuery({
    queryKey: catalogKeys.detail(productId),
    queryFn: () => catalogApi.getProduct(productId),
    staleTime: Infinity,
  });
