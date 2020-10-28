export interface Parametro {
  id: number;
  tarifaId?: any;
  tipoCargoId: number;
  bloqueHorarioId?: any;
  fechaInicio: string;
  fechaFinal: string;
  valor: any;
  observacion?: string;
  estado: boolean;
}
