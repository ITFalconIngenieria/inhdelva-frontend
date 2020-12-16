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

            console.log(data);


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
              this.spinner.hide();
            }
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
      const worksheet = xlsx.utils.json_to_sheet(this.listOfData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Proveedores_de_Energia');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + EXCEL_EXTENSION);
    });
  }

}
