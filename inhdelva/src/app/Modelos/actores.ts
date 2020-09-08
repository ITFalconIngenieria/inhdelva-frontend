export interface ActoresModel {
  Codigo: string;
  TipoActor: boolean;
  Imagen: string;
  Observacion: string;
  Estado: boolean;
}

export interface ClientesModel {
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

export interface ActoresSap {
  Cardcode: string;
  Cardname: string;
  vatiduncmp?: string;
  Contacto?: string;
  Address?: string;
  phone1?: string;
  E_mail?: string;
}
