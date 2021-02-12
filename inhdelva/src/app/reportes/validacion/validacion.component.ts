import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportesService } from '../../servicios/reportes.service';
import 'jspdf-autotable';
import jspdf from 'jspdf';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {

  listOfData: any[] = [];
  colspan: number;
  dataInh: any[] = [];
  dataUsu: any[] = [];

  colsUSU: any[];
  colsExportUSU: any[] = [];
  dataPDFUSU: any[] = [];
  dataPDFExportUSU: any[] = [];

  colsINH: any[];
  colsExportINH: any[] = [];
  dataPDFINH: any[] = [];
  dataPDFExportINH: any[] = [];

  isVisible = false;
  fechas = null;
  constructor(
    private spinner: NgxSpinnerService,
    private reporteService: ReportesService
  ) { }

  ngOnInit() {
  }

  consultar() {
    this.listOfData = [];
    this.dataInh = [];
    this.dataUsu = [];
    this.colsINH = [];
    this.colsUSU = [];
    this.dataPDFINH = [];
    this.dataPDFUSU = [];
    this.colsExportINH = [];
    this.colsExportUSU = [];

    this.spinner.show();
    if (this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un rango de fechas'
      });
      this.isVisible = false;
    } else {

      this.reporteService.validacion(
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            this.listOfData = data;
            this.colspan = data.length;
            console.log(data);

            this.listOfData.forEach(x => {
              this.dataUsu = [...this.dataUsu, {
                'FECHA': moment(x.fecha).format('MM-YYYY'),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)': Math.round(x.consumoTotalEAFact * 100) / 100,
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)': Math.round(x.consumoTotalEASC * 100) / 100,
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)': Math.round(x.consumoTotalEAI * 100) / 100,
                'PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)': Math.round(x.perdidaTotal * 100) / 100,
                'TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)': Math.round(x.totalEAexportada * 100) / 100,
                'CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)': Math.round(x.cargoTotalEA * 100) / 100,
                'CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)': Math.round(x.cargoTotalPotencia * 100) / 100,
                'CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)': Math.round(x.cargoTotalER * 100) / 100,
                'CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)': Math.round(x.cargoTotalCO * 100) / 100,
                'CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)': Math.round(x.cargoTotalCSC * 100) / 100,
                'CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)': Math.round(x.cargoTotalIlum * 100) / 100,
                'CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)': Math.round(x.cargoPI * 100) / 100,
                'FACTURACION TOTAL A LOS USUARIOS (US$)': Math.round(x.facturacionTotal * 100) / 100,
                'DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)': Math.round(x.diferenciaFacturacionConsumo * 100) / 100,
                'PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)': Math.round(x.porcentajeDiferencia * 100) / 100,
                'PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)': 0,
                'COSTO ENERGIA SOLAR (US$)': 0,
                'COSTOS SERVICIOS ADMINISTRATIVOS, MANTENIMIENTO DE RED DE DISTRIBUCION Y EQUIPOS AUXILIARES (US$)': 0,
                'DIFERENCIA ENTRE FACTURACION DE USUARIOS, CONSUMO DE INHDELVA Y COSTOS ENERGIA SOLAR (US$)': 0,
                'MARGEN GLOBAL DE LA FACTURACION A LOS USUARIOS (%)': 0
              }]
            });

            this.colsUSU = [['Descripcion', ...this.dataUsu.map(x => x.FECHA)]]
            this.dataPDFUSU = [
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)', ...this.dataUsu.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)', ...this.dataUsu.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes))', ...this.dataUsu.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)'])],
              ['PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)', ...this.dataUsu.map(x => x['PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)'])],
              ['TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)', ...this.dataUsu.map(x => x['TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)'])],
              ['CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)'])],
              ['FACTURACION TOTAL A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['FACTURACION TOTAL A LOS USUARIOS (US$)'])],
              ['DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)', ...this.dataUsu.map(x => x['DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)'])],
              ['PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)', ...this.dataUsu.map(x => x['PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)'])],
              ['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)', ...this.dataUsu.map(x => x['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)'])],
              ['COSTO ENERGIA SOLAR (US$)', ...this.dataUsu.map(x => x['COSTO ENERGIA SOLAR (US$)'])],
              ['COSTOS SERVICIOS ADMINISTRATIVOS, MANTENIMIENTO DE RED DE DISTRIBUCION Y EQUIPOS AUXILIARES (US$)', ...this.dataUsu.map(x => x['COSTOS SERVICIOS ADMINISTRATIVOS, MANTENIMIENTO DE RED DE DISTRIBUCION Y EQUIPOS AUXILIARES (US$)'])],
              ['DIFERENCIA ENTRE FACTURACION DE USUARIOS, CONSUMO DE INHDELVA Y COSTOS ENERGIA SOLAR (US$)', ...this.dataUsu.map(x => x['COSTO ENERGIA SOLAR (US$)'])],
              ['MARGEN GLOBAL DE LA FACTURACION A LOS USUARIOS (%)', ...this.dataUsu.map(x => x['MARGEN GLOBAL DE LA FACTURACION A LOS USUARIOS (%)'])]
            ]

            this.listOfData.forEach(element => {
              this.dataInh = [...this.dataInh, {
                'FECHA': moment(element.fecha).format('MM-YYYY'),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)': Math.round(element.consumoTotalEA * 100) / 100,
                'TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)': Math.round(element.totalEAexportada * 100) / 100,
                'TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)': Math.round(element.totalEnergiaProducidaAuto * 100) / 100,
                'TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)': Math.round(element.totalEnergiaConsumida * 100) / 100,
                'TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)': Math.round(element.totalEnergiaProducida * 100) / 100,
                'FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)': Math.round(element.FraccionEnergiaSolar * 100) / 100,
                'CARGO POR ENERGIA A INHDELVA (US$)': Math.round(element.cargoEnergia * 100) / 100,
                'CARGO POR POTENCIA A INHDELVA (US$)': Math.round(element.cargoPotencia * 100) / 100,
                'CARGO POR ENERGIA REACTIVA A INHDELVA (US$)': Math.round(element.cargoReactiva * 100) / 100,
                'CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)': Math.round(element.cargoAlumbrado * 100) / 100,
                'CARGO POR COMERCIALIZACION A INHDELVA (US$)': Math.round(element.cargoComercializacion * 100) / 100,
                'CARGO POR REGULACION A INHDELVA (US$)': Math.round(element.cargoRegulacion * 100) / 100,
                'PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)': Math.round(element.totalProveedores * 100) / 100
              }]
            });

            this.colsINH = [['Descripcion', ...this.dataInh.map(x => x.FECHA)]]
            this.dataPDFINH = [
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)', ...this.dataInh.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)'])],
              ['TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)'])],
              ['TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)'])],
              ['TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)'])],
              ['TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)'])],
              ['FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)', ...this.dataInh.map(x => x['FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)'])],
              ['CARGO POR ENERGIA A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR ENERGIA A INHDELVA (US$)'])],
              ['CARGO POR POTENCIA A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR POTENCIA A INHDELVA (US$)'])],
              ['CARGO POR ENERGIA REACTIVA A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR ENERGIA REACTIVA A INHDELVA (US$)'])],
              ['CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)'])],
              ['CARGO POR COMERCIALIZACION A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR COMERCIALIZACION A INHDELVA (US$)'])],
              ['CARGO POR REGULACION A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR REGULACION A INHDELVA (US$)'])],
              ['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)', ...this.dataInh.map(x => x['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)'])]
            ]

            if (this.listOfData.length === 0) {
              this.spinner.hide();
              this.isVisible = false;
              swal({
                icon: 'warning',
                title: 'No se pudo encontrar información'
                // text: 'Por verifique las opciones seleccionadas.'
              });
            }
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.isVisible = false;
            swal({
              icon: 'warning',
              title: 'No se pudo encontrar información',
              text: 'Por verifique las opciones seleccionadas.'
            });

            console.log(error);
          }
        );
    }

  }

  exportExcel() {

    // Excel Inhdelva
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataInh);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'INFORMACIÓN GLOBAL DE INHDELVA');
    });

    // Excel Usuarios
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataUsu);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'INFORMACION GLOBAL DE LOS USUARIOS DEL PARQUE');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

  exportPdf() {
    let tamano = this.colsUSU[0].length;

    this.colsExportUSU[0] = this.colsUSU[0].slice(0, 4);
    this.dataPDFExportUSU[0] = this.dataPDFUSU[0].slice(0, 4);
    this.dataPDFExportUSU[1] = this.dataPDFUSU[1].slice(0, 4);
    this.dataPDFExportUSU[2] = this.dataPDFUSU[2].slice(0, 4);
    this.dataPDFExportUSU[3] = this.dataPDFUSU[3].slice(0, 4);
    this.dataPDFExportUSU[4] = this.dataPDFUSU[4].slice(0, 4);
    this.dataPDFExportUSU[5] = this.dataPDFUSU[5].slice(0, 4);
    this.dataPDFExportUSU[6] = this.dataPDFUSU[6].slice(0, 4);
    this.dataPDFExportUSU[7] = this.dataPDFUSU[7].slice(0, 4);
    this.dataPDFExportUSU[8] = this.dataPDFUSU[8].slice(0, 4);
    this.dataPDFExportUSU[9] = this.dataPDFUSU[9].slice(0, 4);
    this.dataPDFExportUSU[10] = this.dataPDFUSU[10].slice(0, 4);
    this.dataPDFExportUSU[11] = this.dataPDFUSU[11].slice(0, 4);
    this.dataPDFExportUSU[12] = this.dataPDFUSU[12].slice(0, 4);
    this.dataPDFExportUSU[13] = this.dataPDFUSU[13].slice(0, 4);
    this.dataPDFExportUSU[14] = this.dataPDFUSU[14].slice(0, 4);

    this.colsExportINH[0] = this.colsINH[0].slice(0, 4);
    this.dataPDFExportINH[0] = this.dataPDFINH[0].slice(0, 4);
    this.dataPDFExportINH[1] = this.dataPDFINH[1].slice(0, 4);
    this.dataPDFExportINH[2] = this.dataPDFINH[2].slice(0, 4);
    this.dataPDFExportINH[3] = this.dataPDFINH[3].slice(0, 4);
    this.dataPDFExportINH[4] = this.dataPDFINH[4].slice(0, 4);
    this.dataPDFExportINH[5] = this.dataPDFINH[5].slice(0, 4);
    this.dataPDFExportINH[6] = this.dataPDFINH[6].slice(0, 4);
    this.dataPDFExportINH[7] = this.dataPDFINH[7].slice(0, 4);
    this.dataPDFExportINH[8] = this.dataPDFINH[8].slice(0, 4);
    this.dataPDFExportINH[9] = this.dataPDFINH[9].slice(0, 4);
    this.dataPDFExportINH[10] = this.dataPDFINH[10].slice(0, 4);
    this.dataPDFExportINH[11] = this.dataPDFINH[11].slice(0, 4);
    this.dataPDFExportINH[12] = this.dataPDFINH[12].slice(0, 4);

    const docUSU = new jspdf('p', 'in', 'letter');
    (docUSU as any).autoTable(
      {
        head: this.colsExportUSU,
        body: this.dataPDFExportUSU,
        theme: 'striped'
      }
    );
    const docINH = new jspdf('p', 'in', 'letter');
    (docINH as any).autoTable(
      {
        head: this.colsExportINH,
        body: this.dataPDFExportINH,
        theme: 'striped'
      }
    );

    for (let x = 4; x < tamano;) {
      this.colsExportUSU[0] = this.colsUSU[0].slice(x, (x + 4));
      this.dataPDFExportUSU[0] = this.dataPDFUSU[0].slice(x, (x + 4));
      this.dataPDFExportUSU[1] = this.dataPDFUSU[1].slice(x, (x + 4));
      this.dataPDFExportUSU[2] = this.dataPDFUSU[2].slice(x, (x + 4));
      this.dataPDFExportUSU[3] = this.dataPDFUSU[3].slice(x, (x + 4));
      this.dataPDFExportUSU[4] = this.dataPDFUSU[4].slice(x, (x + 4));
      this.dataPDFExportUSU[5] = this.dataPDFUSU[5].slice(x, (x + 4));
      this.dataPDFExportUSU[6] = this.dataPDFUSU[6].slice(x, (x + 4));
      this.dataPDFExportUSU[7] = this.dataPDFUSU[7].slice(x, (x + 4));
      this.dataPDFExportUSU[8] = this.dataPDFUSU[8].slice(x, (x + 4));
      this.dataPDFExportUSU[9] = this.dataPDFUSU[9].slice(x, (x + 4));
      this.dataPDFExportUSU[10] = this.dataPDFUSU[10].slice(x, (x + 4));
      this.dataPDFExportUSU[11] = this.dataPDFUSU[11].slice(x, (x + 4));
      this.dataPDFExportUSU[12] = this.dataPDFUSU[12].slice(x, (x + 4));
      this.dataPDFExportUSU[13] = this.dataPDFUSU[13].slice(x, (x + 4));
      this.dataPDFExportUSU[14] = this.dataPDFUSU[14].slice(x, (x + 4));

      this.colsExportINH[0] = this.colsINH[0].slice(x, (x + 4));
      this.dataPDFExportINH[0] = this.dataPDFINH[0].slice(x, (x + 4));
      this.dataPDFExportINH[1] = this.dataPDFINH[1].slice(x, (x + 4));
      this.dataPDFExportINH[2] = this.dataPDFINH[2].slice(x, (x + 4));
      this.dataPDFExportINH[3] = this.dataPDFINH[3].slice(x, (x + 4));
      this.dataPDFExportINH[4] = this.dataPDFINH[4].slice(x, (x + 4));
      this.dataPDFExportINH[5] = this.dataPDFINH[5].slice(x, (x + 4));
      this.dataPDFExportINH[6] = this.dataPDFINH[6].slice(x, (x + 4));
      this.dataPDFExportINH[7] = this.dataPDFINH[7].slice(x, (x + 4));
      this.dataPDFExportINH[8] = this.dataPDFINH[8].slice(x, (x + 4));
      this.dataPDFExportINH[9] = this.dataPDFINH[9].slice(x, (x + 4));
      this.dataPDFExportINH[10] = this.dataPDFINH[10].slice(x, (x + 4));
      this.dataPDFExportINH[11] = this.dataPDFINH[11].slice(x, (x + 4));
      this.dataPDFExportINH[12] = this.dataPDFINH[12].slice(x, (x + 4));

      docUSU.addPage('p');
      (docUSU as any).autoTable(
        {
          head: this.colsExportUSU,
          body: this.dataPDFExportUSU,
          theme: 'striped'
        }
      );

      docINH.addPage('p');
      (docINH as any).autoTable(
        {
          head: this.colsExportINH,
          body: this.dataPDFExportINH,
          theme: 'striped'
        }
      );

      x = x + 4;
    }

    docUSU.save('InformeValidacionUsuarios.pdf');
    docINH.save('InformeValidacionInhdelva.pdf');
  }


}
