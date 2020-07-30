export interface Factura {
  Id: number;
  Codigo: string;
  FechaEmmision: string;
  FechaInicio: string;
  FechaFin: string;
  FechaVencimiento: string;
  ClienteId: number;
  Estado: boolean;
}
