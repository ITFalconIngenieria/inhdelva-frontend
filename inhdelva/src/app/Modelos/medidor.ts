
export interface Medidor {
  codigo: string;
  lecturaMax: any;
  multiplicador: number;
  observacion: string;
  estado: boolean;
}

export interface MedidorPME {
  id: number;
  codigo: string;
  descripcion: string;
  serie?: string;
  modelo: string;
  ip: string;
  lecturaMax?: any;
  multiplicador: number;
  observacion?: any;
  contrato: boolean;
}

export interface RolloverModel {
  id: number;
  medidorId: number;
  fecha: string;
  energia: boolean;
  lecturaAnterior: any;
  lecturaNueva: any;
  observacion: string;
  estado: boolean;
}