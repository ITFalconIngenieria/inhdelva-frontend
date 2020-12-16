import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportesService } from '../../servicios/reportes.service';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {
  listOfData: any[] = [];
  colspan: number;

  isVisible = false;
  fechas = null;
  constructor(
    private spinner: NgxSpinnerService,
    private reporteService: ReportesService
  ) { }

  ngOnInit() {
  }

  consultar() {
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
        moment(moment(this.fechas[0]).format('YYYY-MM-DD')).toISOString(),
        moment(moment(this.fechas[1]).format('YYYY-MM-DD')).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            this.listOfData = data;
            this.colspan = data.length;

            console.log(this.listOfData);

            // this.listaTotales = this.listOfDataProduccion.reduce((acumulador, valorActual) => {
            //   let x = 1;
            //   const elementoYaExiste = acumulador.find(elemento => elemento.proveedor === valorActual.proveedor);
            //   if (elementoYaExiste) {
            //     return acumulador.map((elemento) => {
            //       if (moment(elemento.fecha).get('year') === moment(valorActual.fecha).get('year')) {
            //         return {
            //           ...elemento,
            //           x: x,
            //           produccionTotalEnergiaSolar: elemento.produccionTotalEnergiaSolar + valorActual.produccionTotalEnergiaSolar,
            //           energiaExportadaHaciaRed: elemento.energiaExportadaHaciaRed + valorActual.energiaExportadaHaciaRed,
            //           energiaAutoconsumoINH: elemento.energiaAutoconsumoINH + valorActual.energiaAutoconsumoINH,
            //           energiaConsumidaRed: elemento.energiaConsumidaRed + valorActual.energiaConsumidaRed,
            //           consumoEnergiaTotalINH: elemento.consumoEnergiaTotalINH + valorActual.consumoEnergiaTotalINH,
            //           fraccionEnergiaSolarAutoconsumo: elemento.fraccionEnergiaSolarAutoconsumo + valorActual.fraccionEnergiaSolarAutoconsumo,
            //           fraccionEnergiaSolarTotal: elemento.fraccionEnergiaSolarTotal + valorActual.fraccionEnergiaSolarTotal,
            //           costoEnergiaINH: elemento.costoEnergiaINH + valorActual.costoEnergiaINH,
            //           energiaTotalINH: elemento.energiaTotalINH + valorActual.energiaTotalINH,
            //           costoTotalEnergiaINH: elemento.costoTotalEnergiaINH + valorActual.costoTotalEnergiaINH,
            //           consumoActualEnergiaRed: elemento.consumoActualEnergiaRed + valorActual.consumoActualEnergiaRed,
            //           costoEnergiaConsumidaRed: elemento.costoEnergiaConsumidaRed + valorActual.costoEnergiaConsumidaRed,
            //           ahorroEnergiaSolar: elemento.ahorroEnergiaSolar + valorActual.ahorroEnergiaSolar,
            //           ahorroSolar: elemento.ahorroSolar + valorActual.ahorroSolar,
            //           produccionRealEnergiaSolar: elemento.produccionRealEnergiaSolar + valorActual.produccionRealEnergiaSolar,
            //           produccionEstimadaEnergiaSolar: elemento.produccionEstimadaEnergiaSolar + valorActual.produccionEstimadaEnergiaSolar,
            //           degradacionMaxima: elemento.degradacionMaxima + valorActual.degradacionMaxima,
            //           porcentajeCumplimiento: elemento.porcentajeCumplimiento + valorActual.porcentajeCumplimiento
            //         };
            //       }
            //       x += 1;

            //       return elemento;
            //     });
            //   }

            //   console.log(x);
            //   x += 1;
            //   return [...acumulador, valorActual];
            // }, []);

            // console.log(this.listaTotales);

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
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.listOfData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Produccion ');
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
