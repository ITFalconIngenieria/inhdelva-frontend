import { Component, OnInit } from '@angular/core';
import { ClientesVista, ActoresSapSearch, ClientesModel } from '../../Modelos/actores';
import { ActoresService } from '../../servicios/actores.service';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  isVisible = false;
  actoresSap: ActoresSapSearch[] = [];
  codVisible = false;
  idProveedor;
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

  accion: string;
  listOfDataProveedores: any[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];

  constructor(
    private actoresService: ActoresService,
    private notification: NzNotificationService
  ) { }

  busquedad() {
    const codigo = this.codigo;

    const provedor: ActoresSapSearch[] = this.actoresSap.filter(x => x.Cardcode === codigo);

    if (provedor.length > 0) {
      this.nombreEmpresa = provedor[0].Cardname;
      this.rtn = provedor[0].vatiduncmp;
      this.contacto = provedor[0].Contacto;
      this.tel = provedor[0].phone1;
      this.email = provedor[0].E_mail;
      this.direccion = provedor[0].Address;
    } else {
      this.codigo = '';
      swal({
        icon: 'warning',
        text: 'No se encontró ese provedor'
      });
    }

  }

  guardar() {
    const proveedorData = {
      codigo: this.codigo,
      tipoActor: true,
      imagen: (this.imagen) ? this.imagen : '',
      observacion: (this.observacion === '' || this.observacion === null) ? 'N/A' : this.observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.actoresService.putProveedor(this.idProveedor, proveedorData)
        .toPromise()
        .then(
          () => {
            this.codVisible = false;
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataProveedores.filter(x => x.Id === this.idProveedor)) {
              item.Observacion = proveedorData.observacion;
              item.Imagen = proveedorData.imagen;
            }

            this.listOfDisplayData = [...this.listOfDataProveedores];
            this.accion = 'new';
            this.limpiar();
            this.isVisible = false;
          },
          (error) => {
            this.limpiar();

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            this.accion = 'new';
            console.log(error);
            this.isVisible = false;

          }
        );
    } else {
      this.actoresService.postProveedor(proveedorData)
        .toPromise()
        .then(
          (data) => {
            this.listOfDataProveedores = [...this.listOfDataProveedores,
            {
              'Codigo': this.codigo,
              'Contacto': this.contacto,
              'Direccion': this.direccion,
              'Email': this.email,
              'Imagen': this.imagen,
              'Nombre': this.nombreEmpresa,
              'Observacion': this.observacion,
              'RTN': this.rtn,
              'Telefono': this.tel,
              'TipoActor': true
            }
            ];
            this.listOfDisplayData = [...this.listOfDataProveedores];

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            this.limpiar();
          },
          (error) => {
            this.limpiar();

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
    this.codVisible = true;
    this.idProveedor = data.Id;
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
    swal({
      title: "¿Está seguro de borrar el registro?",
      // text: "Una vez eliminado el registro ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.actoresService.delteProveedor(data.Id, { estado: false })
            .toPromise()
            .then(
              () => {
                this.ShowNotification(
                  'success',
                  'Eliminado',
                  'El registro fue eliminado con éxito'
                );
                this.listOfDataProveedores = this.listOfDataProveedores.filter(x => x.Id !== data.Id);
                this.listOfDisplayData = [...this.listOfDataProveedores];

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

        } else {
          swal("Su registro sigue activo");
        }
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataProveedores.filter((item: any) => (item.Nombre.indexOf(this.searchValue) !== -1));
  }

  limpiar() {
    this.codigo = '';
    this.nombreEmpresa = '';
    this.rtn = '';
    this.contacto = '';
    this.tel = '';
    this.email = '';
    this.direccion = '';
    this.imagen = '';
    this.observacion = '';
  }

  ngOnInit() {
    this.accion = 'new';

    this.actoresService.getProveedores()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataProveedores = data;
          this.listOfDisplayData = [...this.listOfDataProveedores];
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

  sort() {
    let array = this.listOfDataProveedores.sort(function (a, b) {
      return a.Nombre.localeCompare(b.Nombre);
    });
    this.listOfDisplayData = [...array]
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
    this.codVisible = false;
    this.accion = 'new';
    this.limpiar();
  }

  handleOk(): void {
    this.isVisible = false;
    this.codVisible = false;
    this.accion = 'new';
    this.limpiar();

  }

}
