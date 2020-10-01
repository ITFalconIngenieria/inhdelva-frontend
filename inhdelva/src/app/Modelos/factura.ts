export class EncabezadoFactura {
  id: number;
  codigo: string;
  fechaLectura?: any;
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

export class BloquesdeEnergia {
  id: number;
  periodoId: number;
  valor: number;
  lps: number;
  facturaId: number;
  estado: boolean;
}

export class DetalleFactura {
  id: number;
  descripcion: string;
  valor: number;
  facturaId: number;
}

export class ListadoFactura {
  id: number;
  codigo: string;
  contrato: string;
  cliente: string;
  fechaLectura: string;
  consumo: number;
  total: number;
  Estado: number;
}
