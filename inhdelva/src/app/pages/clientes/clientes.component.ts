import { Component, OnInit } from '@angular/core';
import { ClientesModel, ActoresSap } from '../../Modelos/actores';
import { ActoresService } from '../../servicios/actores.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  isVisible = false;
  clienteFiltrado: ActoresSap[] = [];
  listOfDataClientes: ClientesModel[] = [];
  codigo: string;
  nombre: string;
  rtn: string;
  contacto: string;
  tel: string;
  email: string;
  direccion: string;
  imagen: string;
  observacion: string;

  constructor(
    private actoresService: ActoresService
  ) { }

  busquedad() {
    const codigo = this.codigo;
    this.actoresService.busquedad()
      .toPromise()
      .then(
        (data: ActoresSap[]) => {
          const cliente = data.filter(x => x.Cardcode === codigo);
          this.clienteFiltrado = { ...cliente };

          console.log(this.clienteFiltrado);

        }
      );

  }

  ngOnInit() {

    this.actoresService.getClientes()
      .toPromise()
      .then(
        (data: any[]) => {
          console.log(data);

          this.listOfDataClientes = data;
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
