import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PedidoRequest } from 'src/app/models/Pedido';
import { ProductoResponse } from 'src/app/models/producto-response';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto';
import Swal from 'sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})

export class UsuarioListComponent implements OnInit{

  closeResult = '';
  productos: ProductoResponse[] = [];

  productoEliminar: ProductoResponse[] = [];
  ProductoNombrePedidoSelect: string = '';
  ProductoIdPedidoSelect: string = '';
  ProductoCantidadPedidoSelect: number = 0;
  ProductoNotaPedidoSelect: string = '';

  Pedido: PedidoRequest | null =null;
  accionActual: 'crear' | 'actualizar' = 'crear';

  constructor(
    private productoService: ProductoService, 
    private modalService: NgbModal, 
    private router: Router,
    private pedidoService: PedidoService) { }

  ngOnInit() {
    this.cargarProductosActualizado();
  }

  irBuscar(){
    this.router.navigateByUrl('/dashboard/usuario/categoriamarca/search')
  }

  cargarProductosActualizado() {
    this.productoService.getListaProductos().subscribe(response => {
      this.productos = response;
    }, error => {
      console.error('Error al obtener los productos:', error);
    });
  }

  abrirModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-header modal-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  eliminarProducto(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe(() => {
          this.productoEliminar = this.productoEliminar.filter(p => p.id !== id);
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado.',
            'success'
          );
          this.cargarProductosActualizado();

        }, error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el producto.',
            'error'
          );
        });
      }
    });
  }
  RegistrarPedido(){
    this.Pedido = {
      id: '',
      id_producto: this.ProductoIdPedidoSelect,
      fecha: new Date().toISOString(),
      id_usuario: '',
      cantidad: this.ProductoCantidadPedidoSelect,
      estado: 'pendiente',
      nota: this.ProductoNotaPedidoSelect,
      tenantId:''
    }
    this.pedidoService.registrar(this.Pedido).subscribe({
      next: () => {
        //actualizar productos
        Swal.fire({
          icon: 'success',
          title: 'Pedido agregado',
          text: 'El pedido ha sido registrado.',
        });
        
      },
      error:(error)  => {
        Swal.fire({
          icon: 'error',
          title: 'pedido no registrado',
          text: error,
        });
      }
    });
  }
  abrirModalPedido(content: any, id: string, nombre: string){
    this.ProductoIdPedidoSelect = id;
    this.ProductoNombrePedidoSelect = nombre;
    this.abrirModal(content);
  }
  getCurrentDateTime(): string {
    return new Date().toISOString();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
