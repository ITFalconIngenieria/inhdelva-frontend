import { Component, OnInit } from '@angular/core';

interface ItemData {
  id: number;
  name: string;
  age: string;
  address: string;
  energia: string;
  Total: string;
}

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
  listOfCurrentPageData: ItemData[] = [];
  listOfData: ItemData[] = [];
  setOfCheckedId = new Set<number>();
  constructor() { }

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

  onCurrentPageDataChange($event: ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  ngOnInit() {
    this.listOfData = new Array(200).fill(0).map((_, index) => {
      return {
        id: index,
        name: `CNT- ${index}`,
        age: 'XXXX',
        address: `##/##/####`,
        energia: '#,###.##',
        Total: '#,###.##'
      };
    });
  }

}
