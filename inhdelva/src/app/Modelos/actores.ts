export interface ClientesModel {
  codigo: string;
  tipoActor: boolean;
  imagen: string;
  observacion: string;
  estado: boolean;
}

export interface ActoresSapSearch {
  Cardcode: string;
  Cardname: string;
  vatiduncmp?: string;
  Contacto?: string;
  Address?: string;
  phone1?: string;
  E_mail?: string;
}

export interface ClientesVista {
  Id: number;
  Codigo: string;
  Nombre: string;
  RTN?: string;
  Contacto?: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  Imagen?: string;
  Observacion: string;
  TipoActor: boolean;
}

