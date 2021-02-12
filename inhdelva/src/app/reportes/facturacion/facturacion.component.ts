import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import * as moment from 'moment';
import swal from 'sweetalert';
import { ContratoService } from '../../servicios/contrato.service';
import { NgxSpinnerService } from 'ngx-spinner';
import 'jspdf-autotable';
import jspdf from 'jspdf';

interface Totales {
  ea: number;
  er: number;
}
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  listOfData: any[] = [];
  date = null;
  abrir = false;
  isVisible = false;
  cargando = false;
  contratos: any[] = [];
  listOfOption: Array<{ label: string; value: string }> = [];
  fechas = null;
  listOfContratos: any[] = [];
  listaIDContratos: any[] = [];
  listaTotales: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  dataExport: any[] = [];
  cols: any[] = [];
  dataPDF: any[] = [];
  colsExport: any[] = [];
  dataPDFExport: any[] = [];

  constructor(
    private reporteService: ReportesService,
    private contratoService: ContratoService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    this.contratoService.getAllContratos()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfContratos = data;

          data.forEach(x => {
            this.listaIDContratos = [x.id, ...this.listaIDContratos];
          });

        }
      );
  }

  contratosChange(event: any[]) {

    if (event.includes('0')) {
      this.abrir = false;
      this.contratos = ['0'];
    } else {
      this.abrir = true;
    }

    if (event.length === 0) {
      this.contratos = null;
    }

  }

  consultar() {

    this.colsExport = [];
    this.cols = [];
    this.dataPDFExport = [];
    this.dataPDF = [];
    this.listOfData = [];
    this.listaTotales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.spinner.show();

    if (this.contratos.length === 0 || this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un contrato y un rango de fechas'
      });
      this.isVisible = false;
    } else {
      this.contratos = (this.contratos.includes('0')) ? this.listaIDContratos : this.contratos;

      this.reporteService.facturacion(
        this.contratos,
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.listOfData = data;
            this.isVisible = true;

            if (this.listOfData.length === 0) {
              this.isVisible = false;
              this.spinner.hide();
              swal({
                icon: 'warning',
                title: 'No se pudo encontrar información'
                // text: 'Por verifique las opciones seleccionadas.'
              });
            }

            // tslint:disable-next-line: prefer-for-of
            for (let y = 0; y < this.listOfData.length; y++) {

              this.listaTotales = [
                this.listaTotales[0] + Math.round(data[y].EA * 100) / 100,
                this.listaTotales[1] + Math.round(data[y].ER * 100) / 100,
                this.listaTotales[2] + Math.round(data[y].PM * 100) / 100,
                this.listaTotales[3] + Math.round(data[y].FP * 100) / 100,
                this.listaTotales[4] + Math.round(data[y].FS * 100) / 100,
                '',
                this.listaTotales[6] + Math.round(data[y].CPE * 100) / 100,
                this.listaTotales[7] + Math.round(data[y].P11 * 100) / 100,
                '',
                this.listaTotales[9] + Math.round(data[y].CPC * 100) / 100,
                '',
                this.listaTotales[11] + Math.round(data[y].CER * 100) / 100,
                '',
                '',
                '',
                '',
                this.listaTotales[16] + Math.round(data[y].CCO * 100) / 100,
                '',
                '',
                this.listaTotales[19] + Math.round(data[y].CPI * 100) / 100,
                '',
                '',
                '',
                this.listaTotales[23] + Math.round(data[y].CIC * 100) / 100,
                '',
                '',
                '',
                this.listaTotales[27] + Math.round(data[y].CSC * 100) / 100,
                this.listaTotales[28] + Math.round(data[y].TOTAL * 100) / 100
              ];
            }

            console.log(this.listaTotales);


            this.listOfData.forEach(y => {
              this.dataExport = [...this.dataExport, {
                'Nave': y.nave,
                'Empresa': y.empresa,
                'Cuenta': y.cuenta,
                'Codigo medidor': y.medidor,
                'Codigo tarifa': y.tarifa,
                'Energia Activa (EA)': Math.round(y.EA * 100) / 100,
                'Energia reactiva (ER)': Math.round(y.ER * 100) / 100,
                'Potencia maxima (PM)': Math.round(y.PM * 100) / 100,
                'Factor potencia (FP)': Math.round(y.FP * 100) / 100,
                'Fraccion de energia solar en autoocnsumo (FS)': Math.round(y.FS * 100) / 100,
                'Precio base de energia (PBE)': Math.round(y.PBE * 100) / 100,
                'Cargo por energia(CPE)': Math.round(y.CPE * 100) / 100,
                'Promedio potencia 11 meses (P11)': Math.round(y.P11 * 100) / 100,
                'Precio base potencia (PBP)': Math.round(y.PBP * 100) / 100,
                'Cargo por potencia (CPC)': Math.round(y.CPC * 100) / 100,
                'Factor de recargo (FR)': Math.round((y.FP < 0.9 && y.FP !== 0) ? (0.9 / y.FP) - 1 : 0 * 100) / 100,
                'Cargo por energia reactiva (CER)': Math.round(y.CER * 100) / 100,
                'Costo operativo sistema solar (COS)': Math.round(y.COS * 100) / 100,
                'Costo operativo mantenimiento red de distribucion (COR)': Math.round(y.COR * 100) / 100,
                'Costo operativo de mantenimiento de equipos auxiliares (COE)': Math.round(y.COE * 100) / 100,
                'Costos administrativos (COA)': Math.round(y.COA * 100) / 100,
                'Cargo por costos operativos (CCO)': Math.round(y.CCO * 100) / 100,
                'Punto de medida': y.PuntoMedida,
                'Perdidas internas (PI)': Math.round(y.PI * 100) / 100,
                'Cargo por perdidas internas (CPI)': Math.round(y.CPI * 100) / 100,
                'Energia activa consumida en Alumbrado Público (EAAP)': Math.round(y.EAAP * 100) / 100,
                'Precio de la energia tarifa Alumbrado Público (EAP)': Math.round(y.EAP * 100) / 100,
                'Energía total consumida por los usuarios (ETCU)': Math.round(y.ETCU * 100) / 100,
                'Cargo por iluminación comunitaria (CIC)': Math.round(y.CIC * 100) / 100,
                'Energia activa consumida en servicios comunitarios (EASC)': Math.round(y.EASC * 100) / 100,
                'Precio de la energia tarifa Servicio General de Baja Tensión (EBT)': Math.round(y.EBT * 100) / 100,
                'Energía total consumida por los usuarios (ETCU) ': Math.round(y.ETCU * 100) / 100,
                'Cargo por servicios comunitarios (CSC)': Math.round(y.CSC * 100) / 100,
                'CARGOS TOTALES TARIFA': Math.round(y.TOTAL * 100) / 100
              }]
            });

            this.dataExport = [...this.dataExport, {
              'Nave': '',
              'Empresa': '',
              'Cuenta': 'TOTAL CLIENTES',
              'Codigo medidor': '',
              'Codigo tarifa': '',
              'Energia Activa (EA)': Math.round(this.listaTotales[0] * 100) / 100,
              'Energia reactiva (ER)': Math.round(this.listaTotales[1] * 100) / 100,
              'Potencia maxima (PM)': Math.round(this.listaTotales[2] * 100) / 100,
              'Factor potencia (FP)': Math.round(this.listaTotales[3] * 100) / 100,
              'Fraccion de energia solar en autoocnsumo (FS)': Math.round(this.listaTotales[4] * 100) / 100,
              'Precio base de energia (PBE)': Math.round(this.listaTotales[5] * 100) / 100,
              'Cargo por energia(CPE)': Math.round(this.listaTotales[6] * 100) / 100,
              'Promedio potencia 11 meses (P11)': Math.round(this.listaTotales[7] * 100) / 100,
              'Precio base potencia (PBP)': Math.round(this.listaTotales[8] * 100) / 100,
              'Cargo por potencia (CPC)': Math.round(this.listaTotales[9] * 100) / 100,
              'Factor de recargo (FR)': Math.round(this.listaTotales[10] * 100) / 100,
              'Cargo por energia reactiva (CER)': Math.round(this.listaTotales[11] * 100) / 100,
              'Costo operativo sistema solar (COS)': Math.round(this.listaTotales[12] * 100) / 100,
              'Costo operativo mantenimiento red de distribucion (COR)': Math.round(this.listaTotales[13] * 100) / 100,
              'Costo operativo de mantenimiento de equipos auxiliares (COE)': Math.round(this.listaTotales[14] * 100) / 100,
              'Costos administrativos (COA)': Math.round(this.listaTotales[15] * 100) / 100,
              'Cargo por costos operativos CCO': Math.round(this.listaTotales[16] * 100) / 100,
              'Punto de medida': this.listaTotales[17],
              'Perdidas internas (PI)': Math.round(this.listaTotales[18] * 100) / 100,
              'Cargo por perdidas internas (CPI)': Math.round(this.listaTotales[19] * 100) / 100,
              'Energia activa consumida en Alumbrado Público (EAAP)': Math.round(this.listaTotales[20] * 100) / 100,
              'Precio de la energia tarifa Alumbrado Público (EAP)': Math.round(this.listaTotales[21] * 100) / 100,
              'Energía total consumida por los usuarios (ETCU)': Math.round(this.listaTotales[22] * 100) / 100,
              'Cargo por iluminación comunitaria (CIC)': Math.round(this.listaTotales[23] * 100) / 100,
              'Energia activa consumida en servicios comunitarios (EASC)': Math.round(this.listaTotales[24] * 100) / 100,
              'Precio de la energia tarifa Servicio General de Baja Tensión (EBT)': Math.round(this.listaTotales[25] * 100) / 100,
              'Energía total consumida por los usuarios (ETCU) ': Math.round(this.listaTotales[26] * 100) / 100,
              'Cargo por servicios comunitarios (CSC)': Math.round(this.listaTotales[27] * 100) / 100,
              'CARGOS TOTALES TARIFA': Math.round(this.listaTotales[28] * 100) / 100
            }]

            this.cols = [['Descripcion', ...this.dataExport.map(x => x.Cuenta)]]
            this.dataPDF = [
              ['Nave', ...this.dataExport.map(x => x.Nave)],
              ['Empresa', ...this.dataExport.map(x => x.Empresa)],
              ['Codigo medidor', ...this.dataExport.map(x => x['Codigo medidor'])],
              ['Codigo tarifa', ...this.dataExport.map(x => x['Codigo tarifa'])],
              ['Energia Activa (EA)', ...this.dataExport.map(x => x['Energia Activa (EA)'])],
              ['Energia reactiva (ER)', ...this.dataExport.map(x => x['Energia reactiva (ER)'])],
              ['Potencia maxima (PM)', ...this.dataExport.map(x => x['Potencia maxima (PM)'])],
              ['Factor potencia (FP)', ...this.dataExport.map(x => x['Factor potencia (FP)'])],
              ['Fraccion de energia solar en autoocnsumo (FS)', ...this.dataExport.map(x => x['Fraccion de energia solar en autoocnsumo (FS)'])],
              ['Precio base de energia (PBE)', ...this.dataExport.map(x => x['Precio base de energia (PBE)'])],
              ['Cargo por energia(CPE)', ...this.dataExport.map(x => x['Cargo por energia(CPE)'])],
              ['Promedio potencia 11 meses (P11)', ...this.dataExport.map(x => x['Promedio potencia 11 meses (P11)'])],
              ['Precio base potencia (PBP)', ...this.dataExport.map(x => x['Precio base potencia (PBP)'])],
              ['Cargo por potencia (CPC)', ...this.dataExport.map(x => x['Cargo por potencia (CPC)'])],
              ['Factor de recargo (FR)', ...this.dataExport.map(x => x['Factor de recargo (FR)'])],
              ['Cargo por energia reactiva (CER)', ...this.dataExport.map(x => x['Cargo por energia reactiva (CER)'])],
              ['Costo operativo sistema solar (COS)', ...this.dataExport.map(x => x['Costo operativo sistema solar (COS)'])],
              ['Costo operativo mantenimiento red de distribucion (COR)', ...this.dataExport.map(x => x['Costo operativo mantenimiento red de distribucion (COR)'])],
              ['Costo operativo de mantenimiento de equipos auxiliares (COE)', ...this.dataExport.map(x => x['Costo operativo de mantenimiento de equipos auxiliares (COE)'])],
              ['Costos administrativos (COA)', ...this.dataExport.map(x => x['Costos administrativos (COA)'])],
              ['Cargo por costos operativos (CCO)', ...this.dataExport.map(x => x['Cargo por costos operativos (CCO)'])],
              ['Punto de medida', ...this.dataExport.map(x => x['Punto de medida'])],
              ['Perdidas internas (PI)', ...this.dataExport.map(x => x['Perdidas internas (PI)'])],
              ['Cargo por perdidas internas (CPI)', ...this.dataExport.map(x => x['Cargo por perdidas internas (CPI)'])],
              ['Energia activa consumida en Alumbrado Público (EAAP)', ...this.dataExport.map(x => x['Energia activa consumida en Alumbrado Público (EAAP)'])],
              ['Precio de la energia tarifa Alumbrado Público (EAP)', ...this.dataExport.map(x => x['Precio de la energia tarifa Alumbrado Público (EAP)'])],
              ['Energía total consumida por los usuarios (ETCU)', ...this.dataExport.map(x => x['Energía total consumida por los usuarios (ETCU)'])],
              ['Cargo por iluminación comunitaria (CIC)', ...this.dataExport.map(x => x['Cargo por iluminación comunitaria (CIC)'])],
              ['Energia activa consumida en servicios comunitarios (EASC)', ...this.dataExport.map(x => x['Energia activa consumida en servicios comunitarios (EASC)'])],
              ['Precio de la energia tarifa Servicio General de Baja Tensión (EBT)', ...this.dataExport.map(x => x['Precio de la energia tarifa Servicio General de Baja Tensión (EBT)'])],
              ['Energía total consumida por los usuarios (ETCU) ', ...this.dataExport.map(x => x['Energía total consumida por los usuarios (ETCU) '])],
              ['Cargo por servicios comunitarios (CSC)', ...this.dataExport.map(x => x['Cargo por servicios comunitarios (CSC)'])],
              ['CARGOS TOTALES TARIFA', ...this.dataExport.map(x => x['CARGOS TOTALES TARIFA'])]
            ]

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

  exportPdf() {
    let tamano = this.cols[0].length;
    // let pag = Math.round(tamano / 4);

    this.colsExport[0] = this.cols[0].slice(0, 4);
    this.dataPDFExport[0] = this.dataPDF[0].slice(0, 4);
    this.dataPDFExport[1] = this.dataPDF[1].slice(0, 4);
    this.dataPDFExport[2] = this.dataPDF[2].slice(0, 4);
    this.dataPDFExport[3] = this.dataPDF[3].slice(0, 4);
    this.dataPDFExport[4] = this.dataPDF[4].slice(0, 4);
    this.dataPDFExport[5] = this.dataPDF[5].slice(0, 4);
    this.dataPDFExport[6] = this.dataPDF[6].slice(0, 4);
    this.dataPDFExport[7] = this.dataPDF[7].slice(0, 4);
    this.dataPDFExport[8] = this.dataPDF[8].slice(0, 4);
    this.dataPDFExport[9] = this.dataPDF[9].slice(0, 4);
    this.dataPDFExport[10] = this.dataPDF[10].slice(0, 4);
    this.dataPDFExport[11] = this.dataPDF[11].slice(0, 4);
    this.dataPDFExport[12] = this.dataPDF[12].slice(0, 4);
    this.dataPDFExport[13] = this.dataPDF[13].slice(0, 4);
    this.dataPDFExport[14] = this.dataPDF[14].slice(0, 4);
    this.dataPDFExport[15] = this.dataPDF[15].slice(0, 4);
    this.dataPDFExport[16] = this.dataPDF[16].slice(0, 4);
    this.dataPDFExport[17] = this.dataPDF[17].slice(0, 4);
    this.dataPDFExport[18] = this.dataPDF[18].slice(0, 4);
    this.dataPDFExport[19] = this.dataPDF[19].slice(0, 4);
    this.dataPDFExport[20] = this.dataPDF[20].slice(0, 4);
    this.dataPDFExport[21] = this.dataPDF[21].slice(0, 4);
    this.dataPDFExport[22] = this.dataPDF[22].slice(0, 4);
    this.dataPDFExport[23] = this.dataPDF[23].slice(0, 4);
    this.dataPDFExport[24] = this.dataPDF[24].slice(0, 4);
    this.dataPDFExport[25] = this.dataPDF[25].slice(0, 4);
    this.dataPDFExport[26] = this.dataPDF[26].slice(0, 4);
    this.dataPDFExport[27] = this.dataPDF[27].slice(0, 4);
    this.dataPDFExport[28] = this.dataPDF[28].slice(0, 4);
    this.dataPDFExport[29] = this.dataPDF[29].slice(0, 4);
    this.dataPDFExport[30] = this.dataPDF[30].slice(0, 4);
    this.dataPDFExport[31] = this.dataPDF[31].slice(0, 4);
    this.dataPDFExport[32] = this.dataPDF[32].slice(0, 4);

    const doc = new jspdf('p', 'in', 'letter');
    (doc as any).autoTable(
      {
        head: this.colsExport,
        body: this.dataPDFExport,
        theme: 'striped'
      }
    );

    for (let x = 4; x < tamano;) {
      this.colsExport[0] = this.cols[0].slice(x, (x + 4));
      this.dataPDFExport[0] = this.dataPDF[0].slice(x, (x + 4));
      this.dataPDFExport[1] = this.dataPDF[1].slice(x, (x + 4));
      this.dataPDFExport[2] = this.dataPDF[2].slice(x, (x + 4));
      this.dataPDFExport[3] = this.dataPDF[3].slice(x, (x + 4));
      this.dataPDFExport[4] = this.dataPDF[4].slice(x, (x + 4));
      this.dataPDFExport[5] = this.dataPDF[5].slice(x, (x + 4));
      this.dataPDFExport[6] = this.dataPDF[6].slice(x, (x + 4));
      this.dataPDFExport[7] = this.dataPDF[7].slice(x, (x + 4));
      this.dataPDFExport[8] = this.dataPDF[8].slice(x, (x + 4));
      this.dataPDFExport[9] = this.dataPDF[9].slice(x, (x + 4));
      this.dataPDFExport[10] = this.dataPDF[10].slice(x, (x + 4));
      this.dataPDFExport[11] = this.dataPDF[11].slice(x, (x + 4));
      this.dataPDFExport[12] = this.dataPDF[12].slice(x, (x + 4));
      this.dataPDFExport[13] = this.dataPDF[13].slice(x, (x + 4));
      this.dataPDFExport[14] = this.dataPDF[14].slice(x, (x + 4));
      this.dataPDFExport[15] = this.dataPDF[15].slice(x, (x + 4));
      this.dataPDFExport[16] = this.dataPDF[16].slice(x, (x + 4));
      this.dataPDFExport[17] = this.dataPDF[17].slice(x, (x + 4));
      this.dataPDFExport[18] = this.dataPDF[18].slice(x, (x + 4));
      this.dataPDFExport[19] = this.dataPDF[19].slice(x, (x + 4));
      this.dataPDFExport[20] = this.dataPDF[20].slice(x, (x + 4));
      this.dataPDFExport[21] = this.dataPDF[21].slice(x, (x + 4));
      this.dataPDFExport[22] = this.dataPDF[22].slice(x, (x + 4));
      this.dataPDFExport[23] = this.dataPDF[23].slice(x, (x + 4));
      this.dataPDFExport[24] = this.dataPDF[24].slice(x, (x + 4));
      this.dataPDFExport[25] = this.dataPDF[25].slice(x, (x + 4));
      this.dataPDFExport[26] = this.dataPDF[26].slice(x, (x + 4));
      this.dataPDFExport[27] = this.dataPDF[27].slice(x, (x + 4));
      this.dataPDFExport[28] = this.dataPDF[28].slice(x, (x + 4));
      this.dataPDFExport[29] = this.dataPDF[29].slice(x, (x + 4));
      this.dataPDFExport[30] = this.dataPDF[30].slice(x, (x + 4));
      this.dataPDFExport[31] = this.dataPDF[31].slice(x, (x + 4));
      this.dataPDFExport[32] = this.dataPDF[32].slice(x, (x + 4));

      doc.addPage('p');
      (doc as any).autoTable(
        {
          head: this.colsExport,
          body: this.dataPDFExport,
          theme: 'striped'
        }
      );

      x = x + 4;
    }

    doc.save('InformeFacturacion.pdf');
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataExport);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Informe Proveedores de Energia');
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

}
