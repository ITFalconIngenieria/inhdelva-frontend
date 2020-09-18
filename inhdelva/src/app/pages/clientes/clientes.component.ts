import { Component, OnInit } from '@angular/core';
import { ClientesVista, ActoresSapSearch, ClientesModel } from '../../Modelos/actores';
import { ActoresService } from '../../servicios/actores.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  isVisible = false;
  clienteData: ClientesModel;
  actoresSap: ActoresSapSearch[] = [];
  listOfDataClientes: ClientesVista[] = [];
  codigo: string;
  nombreEmpresa: string;
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

    const cliente: ActoresSapSearch[] = this.actoresSap.filter(x => x.Cardcode === codigo);

    if (cliente.length > 0) {
      this.nombreEmpresa = cliente[0].Cardname;
      this.rtn = cliente[0].vatiduncmp;
      this.contacto = cliente[0].Contacto;
      this.tel = cliente[0].phone1;
      this.email = cliente[0].E_mail;
      this.direccion = cliente[0].Address;
    } else {
      this.codigo = '';
      swal({
        icon: 'warning',
        text: 'No se encontró ese cliente'
      });
    }

  }

  guardar() {
    this.clienteData = {
      codigo: this.codigo,
      tipoActor: false,
      imagen: (this.imagen) ? this.imagen : '',
      observacion: (this.observacion) ? this.observacion : '',
      estado: true
    };

    this.actoresService.postClientes(this.clienteData)
      .toPromise()
      .then(
        (data) => {
          console.log(data);
          this.nombreEmpresa = '';
          this.rtn = '';
          this.contacto = '';
          this.tel = '';
          this.email = '';
          this.direccion = '';
          this.imagen = '';
          this.observacion = '';
        }

      );

  }

  editar(id) {
    this.isVisible = true;


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

    this.actoresService.busquedad()
      .toPromise()
      .then(
        (data: ActoresSapSearch[]) => {
          this.actoresSap = data;
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
