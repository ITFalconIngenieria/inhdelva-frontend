import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import { ActoresService } from '../../servicios/actores.service';
import * as moment from 'moment';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-proveedoresEnergia',
  templateUrl: './proveedoresEnergia.component.html',
  styleUrls: ['./proveedoresEnergia.component.scss']
})
export class ProveedoresEnergiaComponent implements OnInit {
  listOfData: any[] = [];
  date = null;
  abrir = false;
  isVisible = false;
  proveedores: any[] = [];
  fechas = null;
  listOfProveedores: any[] = [];
  listaIDProveedores: any[] = [];
  listaTotales: any[] = [];

  constructor(
    private reporteService: ReportesService,
    private proveedoresService: ActoresService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    this.proveedoresService.getProveedores()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfProveedores = data;

          data.forEach(x => {
            this.listaIDProveedores = [x.Id, ...this.listaIDProveedores];
          });

        }
      );

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

  proveedoresChange(event: any[]) {

    if (event.includes('0')) {
      this.abrir = false;
      this.proveedores = ['0'];
    } else {
      this.abrir = true;
    }

    if (event.length === 0) {
      this.proveedores = null;
    }

  }

  consultar() {

    this.spinner.show();
    if (this.proveedores.length === 0 || this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un proveedor y un rango de fechas'
      });
      this.isVisible = false;
    } else {

      this.proveedores = (this.proveedores.includes('0')) ? this.listaIDProveedores : this.proveedores;

      this.reporteService.proveedoresEnergia(
        this.proveedores,
        moment(moment(this.fechas[0]).format('YYYY-MM-DD')).toISOString(),
        moment(moment(this.fechas[1]).format('YYYY-MM-DD')).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            this.listOfData = data;

            this.listaTotales = this.listOfData.reduce((acumulador, valorActual) => {
              const elementoYaExiste = acumulador.find(elemento => elemento.proveedor === valorActual.proveedor);
              if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                  if (elemento.proveedor === valorActual.proveedor) {
                    return {
                      ...elemento,
                      consumoEnergiaActiva: elemento.consumoEnergiaActiva + valorActual.consumoEnergiaActiva,
                      energiaActivaExportada: elemento.energiaActivaExportada + valorActual.energiaActivaExportada,
                      demandaPotenciaMaxima: elemento.demandaPotenciaMaxima + valorActual.demandaPotenciaMaxima,
                      consumoEnergiaReactiva: elemento.consumoEnergiaReactiva + valorActual.consumoEnergiaReactiva,
                      factorPotencia: elemento.factorPotencia + valorActual.factorPotencia,
                      precioEnergia: elemento.precioEnergia + valorActual.precioEnergia,
                      costoDemanda: elemento.costoDemanda + valorActual.costoDemanda,
                      costoEnergia: elemento.costoEnergia + valorActual.costoEnergia,
                      alumbradoPublico: elemento.alumbradoPublico + valorActual.alumbradoPublico,
                      cargoComercializacion: elemento.consumoEnergiaActiva + valorActual.cargoComercializacion,
                      cargoRegulacion: elemento.cargoRegulacion + valorActual.cargoRegulacion,
                      precioDemanda: elemento.precioDemanda + valorActual.precioDemanda,
                      total: elemento.total + valorActual.total
                    };
                  }
                  return elemento;
                });
              }
              return [...acumulador, valorActual];
            }, []);

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



}
