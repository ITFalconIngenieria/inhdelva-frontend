import { Component, OnInit } from '@angular/core';
import { ClientesVista, ActoresSapSearch, ClientesModel } from '../../Modelos/actores';
import { ActoresService } from '../../servicios/actores.service';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  isVisible = false;
  actoresSap: ActoresSapSearch[] = [];
  listOfDataClientes: ClientesVista[] = [];
  cantidad;
  idCliente;
  codigo: string;
  nombreEmpresa: string;
  rtn: string;
  contacto: string;
  tel: string;
  email: string;
  direccion: string;
  imagen: string;
  observacion: string;
  accion: string;

  constructor(
    private actoresService: ActoresService,
    private notification: NzNotificationService
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
    const clienteData = {
      codigo: this.codigo,
      tipoActor: false,
      imagen: (this.imagen) ? this.imagen : '',
      observacion: (this.observacion === '' || this.observacion === null) ? 'N/A' : this.observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.actoresService.putClientes(this.idCliente, clienteData)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            // for (const item of this.listOfDataClientes.filter(x => x.Id === this.idCliente)) {
            //   item.Codigo = clienteData.codigo;
            //   item.Contacto = clienteData.;
            //   item.Observacion = clienteData.observacion;
            // }

            this.codigo = '';
            this.nombreEmpresa = '';
            this.rtn = '';
            this.contacto = '';
            this.tel = '';
            this.email = '';
            this.direccion = '';
            this.imagen = '';
            this.observacion = '';

            this.accion = 'new';
          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
          }
        );
    } else {
      this.actoresService.postClientes(clienteData)
        .toPromise()
        .then(
          (data) => {

            this.cantidad = this.cantidad + 1;
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            this.codigo = '';
            this.nombreEmpresa = '';
            this.rtn = '';
            this.contacto = '';
            this.tel = '';
            this.email = '';
            this.direccion = '';
            this.imagen = '';
            this.observacion = '';
          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
          }

        );


    }


  }

  editar(data) {
    this.accion = 'editar';
    this.isVisible = true;

    this.idCliente = data.Id;
    this.codigo = data.Codigo;
    this.nombreEmpresa = data.Nombre;
    this.rtn = data.RTN;
    this.contacto = data.Contacto;
    this.tel = data.Telefono;
    this.email = data.Email;
    this.direccion = data.Direccion;
    this.imagen = data.Imagen;
    this.observacion = data.Observacion;

  }

  eliminar(data) {
    this.actoresService.delteProveedor(data.Id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataClientes = this.listOfDataClientes.filter(x => x.Id !== data.Id);
        },
        (error) => {

          this.ShowNotification(
            'error',
            'No se pudo eliminar',
            'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
          );
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.accion = 'nuevo';

    this.actoresService.getClientes()
      .toPromise()
      .then(
        (data: any[]) => {
          this.cantidad = data.length;
          this.listOfDataClientes = data;
        },
        (error) => {

          swal({
            icon: 'error',
            title: 'No se pudo conectar al servidor',
            text: 'Revise su conexión a internet o comuníquese con el proveedor.'
          });

          console.log(error);
        }
      );

    this.actoresService.busquedad()
      .toPromise()
      .then(
        (data: ActoresSapSearch[]) => {
          this.actoresSap = data;
        },
        (error) => {

          swal({
            icon: 'error',
            title: 'No se pudo conectar al servidor',
            text: 'Revise su conexión a internet o comuníquese con el proveedor.'
          });

          console.log(error);
        }
      );

  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.accion = 'new';

    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

}
