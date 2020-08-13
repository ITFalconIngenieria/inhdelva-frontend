import { Component, OnInit } from '@angular/core';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-facturasEmitidas',
  templateUrl: './facturasEmitidas.component.html',
  styleUrls: ['./facturasEmitidas.component.css']
})
export class FacturasEmitidasComponent implements OnInit {

  listOfCurrentPageData: ItemData[] = [];
  listOfData: ItemData[] = [];

  constructor() { }

  onCurrentPageDataChange($event: ItemData[]): void {
    this.listOfCurrentPageData = $event;
  }

  ngOnInit(): void {
    this.listOfData = new Array(200).fill(0).map((_, index) => {
      return {
        id: index,
        name: `Edward King ${index}`,
        age: 32,
        address: `London, Park Lane no. ${index}`
      };
    });
  }

}
