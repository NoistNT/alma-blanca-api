interface Images {
  id: number;
  link: string;
}

export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
  link: string;
  images: Images[];
}
