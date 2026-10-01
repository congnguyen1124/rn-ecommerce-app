import { initialOrders } from '../data/dummyOrders';
import { useOrderStore } from './orderStore';

describe('order Zustand store', () => {
  beforeEach(() => {
    useOrderStore.getState().reset();
  });

  it('marks every seller order in the same Pay1 checkout as paid', () => {
    const base = initialOrders[0]!;
    useOrderStore.setState({
      orders: [
        { ...base, id: 'PAY1-100-1', status: 'waiting_payment' },
        { ...base, id: 'PAY1-100-2', status: 'waiting_payment' },
        { ...base, id: 'OTHER', status: 'waiting_payment' },
      ],
    });

    useOrderStore.getState().markPaid('PAY1-100');

    expect(useOrderStore.getState().orders.map(({ status }) => status)).toEqual([
      'waiting_confirm',
      'waiting_confirm',
      'waiting_payment',
    ]);
  });

  it('moves a delivered order to the completed status', () => {
    useOrderStore.getState().confirmReceived('ON24090182');
    expect(useOrderStore.getState().orders[0]?.status).toBe('done');
  });

  it('prepends a newly placed order to the history', () => {
    const order = { ...initialOrders[0]!, id: 'NEW-ORDER' };
    useOrderStore.getState().addOrder(order);
    expect(useOrderStore.getState().orders[0]?.id).toBe('NEW-ORDER');
  });
});
