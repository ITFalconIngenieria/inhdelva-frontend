export interface Parametro {
  id: number;
  tarifaId?: any;
  tipoCargoId: number;
  bloqueHorarioId?: any;
  fechaInicio: string;
  fechaFinal: string;
  valor: number;
  observacion?: string;
  estado: boolean;
}
