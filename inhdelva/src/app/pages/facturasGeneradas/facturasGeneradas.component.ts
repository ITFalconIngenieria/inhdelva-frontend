import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-facturasGeneradas',
  templateUrl: './facturasGeneradas.component.html',
  styleUrls: ['./facturasGeneradas.component.css']
})
export class FacturasGeneradasComponent implements OnInit {
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: ListadoFactura[] = [];
  listOfDataFacturas: ListadoFactura[] = [];
  setOfCheckedId = new Set<number>();

  constructor(
    private facturaService: FacturaService,
    private router: Router,

  ) { }

  verFactura(data) {
    const navigationExtras: NavigationExtras = {
      state: data
    };
    this.router.navigate(['factura'], navigationExtras);
    this.facturaService.ejecutarNavegacion(data);
  }
  ngOnInit() {

    this.facturaService.getListadoFacturas()
      .toPromise()
      .then(
        (data: ListadoFactura[]) => {
          console.log(data);
          this.listOfDataFacturas = data;

        }
      );

    // this.listOfDataFacturas = new Array(200).fill(0).map((_, index) => {
    //   return {
    //     id: index,
    //     name: `CNT- ${index}`,
    //     age: 'XXXX',
    //     address: `##/##/####`,
    //     energia: '#,###.##',
    //     Total: '#,###.##'
    //   };
    // });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: ListadoFactura[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

}
