import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proveedoresEnergia',
  templateUrl: './proveedoresEnergia.component.html',
  styleUrls: ['./proveedoresEnergia.component.scss']
})
export class ProveedoresEnergiaComponent implements OnInit {
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

  multipleValue = ['a10', 'c12'];
  listOfOption: Array<{ label: string; value: string }> = [];

  constructor() { }

  ngOnInit() {

    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;
  }

  

}
