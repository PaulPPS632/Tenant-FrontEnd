import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoResponse } from 'src/app/models/producto-response';
import { ProductoService } from 'src/app/services/producto';

@Component({
  selector: 'app-usuario-search',
  templateUrl: './usuario-search.component.html',
  styleUrls: ['./usuario-search.component.scss']
})
export class UsuarioSearchComponent {

  productos: ProductoResponse[] = [];
  filtroProducto: ProductoResponse[] = [];

  constructor(private productoService: ProductoService, private router: Router) { }

  ngOnInit() {
    this. cargarProductos();
  }

  Regresar(){
    this.router.navigateByUrl('dashboard/usuario/productos/list')
  }

  cargarProductos() {
    this.productoService.getListaProductos().subscribe(response => {
      this.productos = response;
      this.filtroProducto = response;
    }, error => {
      console.error('Error al obtener las categorías:', error);
    });
  }

  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroProducto = this.productos.filter(pro =>
        //cambiar la categoria (id/nombre/marca) para buscar
        pro.nombre.toLowerCase().includes(searchText)
      );
    } else {
      this.filtroProducto = this.productos;
    }
  }

}
