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
    valor: number;
    observacion?: string;
    estado: boolean;
}
