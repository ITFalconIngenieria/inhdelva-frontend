export interface Contrato {
  id: number;
  codigo: string;
  clasificacion: string;
  descripcion?: string;
  actorId: number;
  fechaCreacion: string;
  fechaVenc?: string;
  diaGeneracion: number;
  diasDisponibles: number;
  observacion?: string;
  exportacion: boolean;
  estado: boolean;
}

export interface ContratoMedidores {
  id: number;
  contratoId: number;
  medidorId: number;
  fechaInicial: any;
  fechaFinal: any;
  zonaId: number;
  area: number;
  tipoServicioId: number;
  trifasica: boolean;
  potencia: number;
  iluminacionTC: boolean;
  iluminacionP: number;
  sComTC: boolean;
  sComP: number;
  tarifaId: number;
  observacion: string;
  estado: boolean;
}
