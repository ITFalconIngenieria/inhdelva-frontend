import { Component, OnInit } from '@angular/core';


interface Data {
  campo: string;
  lecturaActual: string;
  lecturaAnterior: string;
  consumo: number;
  unidades: string;
}

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  listOfData: Data[] = [
    {
      campo: "Fecha Lectura",
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kWh'
    },
    {
      campo: "Activa",
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kVArh'
    },
    {
      campo: "Reactiva",
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kW'
    },
    {
      campo: "Demanda",
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kWh'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
