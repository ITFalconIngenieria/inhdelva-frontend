export interface EncabezadoFactura {
  id: number;
  codigo: string;
  fechaLectura: string;
  fechaEmision?: any;
  fechaVencimiento?: any;
  fechaInicio: string;
  fechaFin: string;
  titular: string;
  direccion: string;
  codigoCliente: string;
  medidor: string;
  medidorId: number;
  tipoConsumo: string;
  tarifa: string;
  tarifaId: number;
  contratoId: number;
  estado: number;
}

export interface BloquesdeEnergia {
  id: number;
  periodoId: number;
  valor: number;
  lps: number;
  facturaId: number;
  estado: boolean;
}

export interface DetalleFactura {
  id: number;
  descripcion: string;
  valor: number;
  facturaId: number;
}