export interface CategoryType {
  id: number;
  name: string;
  image: string;
}

export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: CategoryType;
}

export interface ProductPayload {
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
}
