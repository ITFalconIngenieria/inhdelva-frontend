export interface MedidorCliente {
  Id: number;
  MedidorId: number;
  ClienteId: number;
  FechaInicio: string;
  FechaFin: string;
  PuntoMedicion: number;
  Clasificacion: number;
  TipoServicio: number;
  Edificio: string;
  AreaEdificio: number;
  Trifasica: boolean;
  Observacion: string;
  Estado: boolean;
}
