export interface ICookie {
  name: string;
  value: string;
}

export interface ProductFromApi {
  idProductos: number;
  p_nombre: string;
  p_precio: number;
  p_link: string;
  p_descripcion: string;
  p_oferta: number;
  p_precio_oferta: number;
  p_oferta_fecha_inicio: null;
  p_oferta_fecha: null;
  p_tipo_venta: number;
  p_precio_mayorista: number;
  p_cantidad_minima: number;
  p_destacado: number;
  p_atributos: number;
  p_mostrar_precio: number;
  p_datos_stock: number;
  p_producto_digital: number;
  p_desactivado: number;
  p_orden: number;
  Categorias_idCategorias: number;
  imagenes: [{ idImagenes: number; i_link: string }];
  stock: [
    {
      idStock: number;
      s_cantidad: number;
      s_ilimitado: number;
      s_precio: number;
      s_oferta: number;
      s_precio_oferta: number;
      s_oferta_fecha_inicio: null;
      s_oferta_fecha: null;
      s_precio_mayorista: number;
      s_cantidad_minima: number;
      s_mostrar_precio: number;
      s_imagen: number;
      s_producto_digital_plazo: string;
      s_producto_digital_observacion: string;
      valoratributo: [];
    },
  ];
}

export interface ApiResponse {
  status: number;
  message: { code: number; description: string };
  data: ProductFromApi[];
}

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
  onSale: number;
  images: Images[];
}

export interface FindAllFromApiResponse {
  data: Products[];
}
