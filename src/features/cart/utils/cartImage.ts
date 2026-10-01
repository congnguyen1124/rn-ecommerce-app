import { catalogImages } from '../../catalog/data/dummyCatalog';
import type { ProductImageKey } from '../domain/types';

export const cartImage = (key: ProductImageKey) => catalogImages[key];
