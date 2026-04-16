export interface Spu {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt: string;
}

export interface Sku {
  id: string;
  spuId: string;
  title: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  createdAt: string;
}
