import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportesService } from '../../servicios/reportes.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {


  generatePdf() {
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(documentDefinition).open();
  }


  listOfData: any[] = [];
  colspan: number;
  dataInh: any[] = [];
  dataUsu: any[] = [];
  cols: any[] = [['ID', 'Country', 'Rank', 'Capital']];

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

            this.listOfData.forEach(x => {
              this.dataUsu = [...this.dataUsu, {
                'FECHA': moment(x.fecha).format('MM-YYYY'),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)': x.consumoTotalEAFact,
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)': x.consumoTotalEASC,
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)': x.consumoTotalEAI,
                'PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)': x.perdidaTotal,
                'TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)': x.totalEAexportada,
                'CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)': x.cargoTotalEA,
                'CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)': x.cargoTotalPotencia,
                'CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)': x.cargoTotalER,
                'CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)': x.cargoTotalCO,
                'CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)': x.cargoTotalCSC,
                'CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)': x.cargoTotalIlum,
                'CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)': x.cargoPI,
                'FACTURACION TOTAL A LOS USUARIOS (US$)': x.facturacionTotal,
                'DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)': x.diferenciaFacturacionConsumo,
                'PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)': x.porcentajeDiferencia
              }]
            });

            this.listOfData.forEach(element => {
              this.dataInh = [...this.dataInh, {
                'FECHA': moment(element.fecha).format('MM-YYYY'),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)': element.consumoTotalEA,
                'TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)': element.totalEAexportada,
                'TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)': element.totalEnergiaProducidaAuto,
                'TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)': element.totalEnergiaConsumida,
                'TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)': element.totalEnergiaProducida,
                'FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)': element.FraccionEnergiaSoalr,
                'CARGO POR ENERGIA A INHDELVA (US$)': element.cargoEnergia,
                'CARGO POR POTENCIA A INHDELVA (US$)': element.cargoPotencia,
                'CARGO POR ENERGIA REACTIVA A INHDELVA (US$)': 0,
                'CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)': element.cargoAlumbrado,
                'CARGO POR COMERCIALIZACION A INHDELVA (US$)': element.cargoComercializacion,
                'CARGO POR REGULACION A INHDELVA (US$)': element.cargoRegulacion,
                'PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)': element.totalProveedores
              }]
            });

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

  exportPdf(){
    
  }

  // exportPdf() {
  //   import('jspdf').then(jsPDF => {
  //     import('jspdf-autotable').then(x => {
  //       const doc = new jsPDF.default();
  //       (doc as any).autoTable(
  //         {
  //           head: this.cols,
  //           body: this.products,
  //           theme: 'plain'
  //         }
  //       );
  //       doc.output('dataurlnewwindow');
  //       doc.save('products.pdf');
  //     });
  //   });
  // }

  // exportarPDF() {
  //   const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
  //   pdfmake.createPdf(documentDefinition).open();

  // }

}
