export interface TarifaModel {
    id: number;
    codigo: string;
    puntoMedicionId: number;
    descripcion: string;
    tipo: boolean;
    matrizHorariaId: number;
    estado: boolean;
}

export interface ParametroTarifaModel {
    id: number;
    tarifaId?: number;
    tipoCargoId: number;
    bloqueHorarioId?: number;
    fechaInicio: string;
    fechaFinal: string;
    valor: any;
    observacion?: string;
    estado: boolean;
}

export interface PuntoMedicion {
    id: number;
    codigo: string;
    descripcion: string;
    estado: boolean;
}

export interface MatrizHoraria {
    id: number;
    codigo: string;
    descripcion: string;
}

export interface TipoCargo {
  id: number;
  codigo: string;
  nombre: string;
  unidad: string;
  estado: boolean;
}


