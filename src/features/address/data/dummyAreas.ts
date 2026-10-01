export interface AreaNode {
  name: string;
  children?: AreaNode[];
}

export const areaTree: AreaNode[] = [
  {
    name: 'Hồ Chí Minh',
    children: [
      {
        name: 'Quận 1',
        children: [
          { name: 'Phường Bến Nghé' },
          { name: 'Phường Đa Kao' },
          { name: 'Phường Bến Thành' },
        ],
      },
      {
        name: 'Quận 3',
        children: [{ name: 'Phường Võ Thị Sáu' }, { name: 'Phường 9' }, { name: 'Phường 12' }],
      },
      {
        name: 'Thành phố Thủ Đức',
        children: [
          { name: 'Phường Thảo Điền' },
          { name: 'Phường An Phú' },
          { name: 'Phường Hiệp Bình Chánh' },
        ],
      },
    ],
  },
  {
    name: 'Hà Nội',
    children: [
      {
        name: 'Quận Hoàn Kiếm',
        children: [{ name: 'Phường Hàng Bạc' }, { name: 'Phường Tràng Tiền' }],
      },
      {
        name: 'Quận Ba Đình',
        children: [{ name: 'Phường Liễu Giai' }, { name: 'Phường Ngọc Hà' }],
      },
      {
        name: 'Quận Cầu Giấy',
        children: [{ name: 'Phường Dịch Vọng' }, { name: 'Phường Yên Hoà' }],
      },
    ],
  },
  {
    name: 'Đà Nẵng',
    children: [
      {
        name: 'Quận Hải Châu',
        children: [{ name: 'Phường Hải Châu I' }, { name: 'Phường Bình Hiên' }],
      },
      {
        name: 'Quận Sơn Trà',
        children: [{ name: 'Phường An Hải Bắc' }, { name: 'Phường Mân Thái' }],
      },
    ],
  },
];
