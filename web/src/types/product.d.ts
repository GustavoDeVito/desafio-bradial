import { MovementTypeEnum } from "./movement";

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

export type ProductProps = {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  alertLimit: number;
  movements: {
    id: number;
    type: MovementTypeEnum;
    quantity: number;
    createdAt: Date;
  }[];
  status: boolean;
};
