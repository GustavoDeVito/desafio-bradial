export type ProductsProps = {
  data: {
    id: number;
    name: string;
    description?: string;
    quantity: number;
    alertLimit: number;
    status: boolean;
  }[];
  items: number;
  pages: number;
  page: number;
};
