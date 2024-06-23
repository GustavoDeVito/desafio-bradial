enum MovementTypeEnum {
  INPUT,
  OUTPUT,
}

export type MovementsProps = {
  data: [
    {
      id: number;
      type: MovementTypeEnum;
      products: {
        id: number;
        name: string;
      };
      quantity: number;
      createdAt: Date;
    }
  ];
  items: number;
  pages: number;
  page: number;
};
