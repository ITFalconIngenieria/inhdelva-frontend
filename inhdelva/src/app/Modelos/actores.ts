export interface ClientesModel {
  codigo: string;
  tipoActor: boolean;
  imagen: string;
  observacion: string;
  estado: boolean;
}

export interface ClientesVista {
  Codigo: string;
  Nombre: string;
  RTN?: any;
  Contacto: string;
  Telefono: string;
  Email: string;
  Direccion: string;
  Imagen: string;
  Observacion: string;
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

