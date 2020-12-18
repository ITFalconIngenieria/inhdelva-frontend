import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import * as moment from 'moment';
import swal from 'sweetalert';
import { ContratoService } from '../../servicios/contrato.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
        moment(moment(this.fechas[0]).format('YYYY-MM-DD')).toISOString(),
        moment(moment(this.fechas[1]).format('YYYY-MM-DD')).toISOString()
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
                this.listaTotales[0] + this.listOfData[y].EA,
                this.listaTotales[1] + this.listOfData[y].ER,
                this.listaTotales[2] + this.listOfData[y].PM,
                this.listaTotales[3] + this.listOfData[y].FP,
                this.listaTotales[4] + this.listOfData[y].FS,
                '',
                this.listaTotales[6] + this.listOfData[y].CPE,
                this.listaTotales[7] + this.listOfData[y].P11,
                '',
                this.listaTotales[9] + this.listOfData[y].CPC,
                '',
                this.listaTotales[11] + this.listOfData[y].CER,
                '',
                '',
                '',
                '',
                this.listaTotales[16] + this.listOfData[y].CCO,
                '',
                '',
                this.listaTotales[19] + this.listOfData[y].CPI,
                '',
                '',
                '',
                this.listaTotales[23] + this.listOfData[y].CIC,
                '',
                '',
                '',
                this.listaTotales[27] + this.listOfData[y].CSC,
                this.listaTotales[28] + this.listOfData[y].TOTAL
              ];
            }

            this.listOfData.forEach(y => {
              this.dataExport = [...this.dataExport, {
                'Nave': y.nave,
                'Empresa': y.empresa,
                'Cuenta': y.cuenta,
                'Codigo medidor': y.medidor,
                'Codigo tarifa': y.tarifa,
                'Energia Activa (EA)': y.EA,
                'Energia reactiva (ER)': y.ER,
                'Potencia maxima (PM)': y.PM,
                'Factor potencia (FP)': y.FP,
                'Fraccion de energia solar en autoocnsumo (FS)': y.FS,
                'Precio base de energia (PBE)': y.PBE,
                'Cargo por energia(CPE)': y.CPE,
                'Promedio potencia 11 meses (P11)': y.P11,
                'Precio base potencia (PBP)': y.PBP,
                'Cargo por potencia (CPC)': y.CPC,
                'Factor de recargo (FR)': (y.FP < 0.9 && y.FP !== 0) ? (0.9 / y.FP) - 1 : 0,
                'Cargo por energia reactiva (CER)': y.CER,
                'Costo operativo sistema solar (COS)': y.COS,
                'Costo operativo mantenimiento red de distribucion (COR)': y.COR,
                'Costo operativo de mantenimiento de equipos auxiliares (COE)': y.COE,
                'Costos administrativos (COA)': y.COA,
                'Cargo por costos operativos (CCO)': y.CCO,
                'Punto de medida': y.PuntoMedida,
                'Perdidas internas (PI)': y.PI,
                'Cargo por perdidas internas (CPI)': y.CPI,
                'Energia activa consumida en Alumbrado Público (EAAP)': y.EAAP,
                'Precio de la energia tarifa Alumbrado Público (EAP)': y.EAP,
                'Energía total consumida por los usuarios (ETCU)': y.ETCU,
                'Cargo por iluminación comunitaria (CIC)': y.CIC,
                'Energia activa consumida en servicios comunitarios (EASC)': y.EASC,
                'Precio de la energia tarifa Servicio General de Baja Tensión (EBT)': y.EBT,
                'Energía total consumida por los usuarios (ETCU) ': y.ETCU,
                'Cargo por servicios comunitarios (CSC)': y.CSC,
                'CARGOS TOTALES TARIFA': y.TOTAL
              }]
            });

            this.dataExport = [...this.dataExport, {
              'Nave': '',
              'Empresa': '',
              'Cuenta': '',
              'Codigo medidor': '',
              'Codigo tarifa': 'TOTAL CLIENTES',
              'Energia Activa (EA)': this.listaTotales[0],
              'Energia reactiva (ER)': this.listaTotales[1],
              'Potencia maxima (PM)': this.listaTotales[2],
              'Factor potencia (FP)': this.listaTotales[3],
              'Fraccion de energia solar en autoocnsumo (FS)': this.listaTotales[4],
              'Precio base de energia (PBE)': this.listaTotales[5],
              'Cargo por energia(CPE)': this.listaTotales[6],
              'Promedio potencia 11 meses (P11)': this.listaTotales[7],
              'Precio base potencia (PBP)': this.listaTotales[8],
              'Cargo por potencia (CPC)': this.listaTotales[9],
              'Factor de recargo (FR)': this.listaTotales[10],
              'Cargo por energia reactiva (CER)': this.listaTotales[11],
              'Costo operativo sistema solar (COS)': this.listaTotales[12],
              'Costo operativo mantenimiento red de distribucion (COR)': this.listaTotales[13],
              'Costo operativo de mantenimiento de equipos auxiliares (COE)': this.listaTotales[14],
              'Costos administrativos (COA)': this.listaTotales[15],
              'Cargo por costos operativos CCO': this.listaTotales[16],
              'Punto de medida': this.listaTotales[17],
              'Perdidas internas (PI)': this.listaTotales[18],
              'Cargo por perdidas internas (CPI)': this.listaTotales[19],
              'Energia activa consumida en Alumbrado Público (EAAP)': this.listaTotales[20],
              'Precio de la energia tarifa Alumbrado Público (EAP)': this.listaTotales[21],
              'Energía total consumida por los usuarios (ETCU)': this.listaTotales[22],
              'Cargo por iluminación comunitaria (CIC)': this.listaTotales[23],
              'Energia activa consumida en servicios comunitarios (EASC)': this.listaTotales[24],
              'Precio de la energia tarifa Servicio General de Baja Tensión (EBT)': this.listaTotales[25],
              'Energía total consumida por los usuarios (ETCU) ': this.listaTotales[26],
              'Cargo por servicios comunitarios (CSC)': this.listaTotales[27],
              'CARGOS TOTALES TARIFA': this.listaTotales[28]
            }]

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
