import { Component, OnInit } from '@angular/core';
import { ActoresService } from '../../servicios/actores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  isVisible = false;

  codigo: string;
  nombreEmpresa: string;
  rtn: string;
  representate: string;
  contacto: string;
  tel: string;
  email: string;
  direccion: string;
  imagen: string;
  observacion: string;

  listOfDataProveedores: any[] = [];

  constructor(
    private actoresService: ActoresService
  ) { }

  ngOnInit() {

    this.actoresService.getProveedores()
      .toPromise()
      .then(
        (data) => {

        }
      );

  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

}
