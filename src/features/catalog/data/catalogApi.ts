import { delay } from '../../../shared/utils/delay';
import { getProduct, products, sellers } from './dummyCatalog';

export const catalogApi = {
  async getHome() {
    await delay(280);
    return { products, sellers };
  },
  async getProduct(productId: string) {
    await delay(220);
    const product = getProduct(productId);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    return product;
  },
};
