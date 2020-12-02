import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert';
import { ReportesService } from '../../servicios/reportes.service';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent implements OnInit {
  listOfDataProduccion: any[] = [];
  date = null;
  listOfData: any[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  inicio = null;
  fin = null;
  isVisible = false;

  cols: any[];
  exportColumns: any[];
  products: any[];
  selectedProducts: any[];
  constructor(private reporteService: ReportesService) { }

  ngOnInit() {

    // const data = [];
    // for (let i = 0; i < 100; i++) {
    //   data.push({
    //     name: `Edward King ${i}`,
    //     age: 32,
    //     address: `London, Park Lane no. ${i}`
    //   });
    // }
    // this.listOfDataProduccion = data;


    this.products = [
      [
        1,
        'John Brown',
        32,
        'New York No. 1 Lake Park'
      ],
      [
        2,
        'Jim Green',
        42,
        'London No. 1 Lake Park'
      ],
      [
        3,
        'Joe Black',
        32,
        'Sidney No. 1 Lake Park'
      ]
    ];

    this.cols = [['ID', 'Country', 'Rank', 'Capital']];

    this.exportColumns = this.cols.map(col => ({ title: col.header, datakey: col.field }));

  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  consultar() {
    if (this.inicio === null || this.fin === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un rango de fechas'
      });
      this.isVisible = false;
    } else {

      console.log(this.inicio, this.fin);

      this.reporteService.produccion(
        moment(moment(this.inicio).format('YYYY-MM-DD')).toISOString(),
        moment(moment(this.fin).format('YYYY-MM-DD')).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            console.log(data);
            this.listOfDataProduccion = data;
          }
        );
    }



  }

  exportPdf() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default();
        (doc as any).autoTable(
          {
            head: this.cols,
            body: this.products,
            theme: 'plain'
          }
        );
        doc.output('dataurlnewwindow');
        doc.save('products.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}
