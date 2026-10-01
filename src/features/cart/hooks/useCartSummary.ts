import { useMemo } from 'react';

import { summarizeCart } from '../domain/cartRules';
import { useCartStore } from '../store/cartStore';

export const useCartSummary = () => {
  const groups = useCartStore(({ groups: value }) => value);
  return useMemo(() => summarizeCart(groups), [groups]);
};
