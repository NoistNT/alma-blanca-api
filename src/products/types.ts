export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
  link: string;
  image: { id: number; link: string };
}
