import { Component, OnInit } from '@angular/core';
import { CategoriaResponse } from 'src/app/models/categoria-response';
import { CategoriaMarcaResponse } from 'src/app/models/categoriamarca-response';
import { MarcaResponse } from 'src/app/models/marca-response';
import { ProductoRequest } from 'src/app/models/producto-request';
import { ProductoResponse } from 'src/app/models/producto-response';
import { SubCategoriaResponse } from 'src/app/models/subcategoria-response';
import { CategoriaService } from 'src/app/services/categoria';
import { MarcaService } from 'src/app/services/marca';
import { ProductoService } from 'src/app/services/producto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-create',
  templateUrl: './producto-create.component.html',
  styleUrls: ['./producto-create.component.scss']
})


export class ProductoCreateComponent implements OnInit {

  /* parte 1 */
  MarcaSelect : number = 0;
  Marcas : MarcaResponse [] = [];
  CategoriaMarca: CategoriaMarcaResponse[] = [];

  /* parte 2 */
  CategoriaSelect: number = 0;
  Categoria : CategoriaResponse [] = [];
  Subcategoria: SubCategoriaResponse [] = [];

  nuevoProducto: ProductoRequest = { 
    nombre: '' ,
    pn :'',
    descripcion:'',
    stock: 1,
    precio: 1,
    id_categoriamarca: 1,
    id_subcategoria: 1,
    garantia_cliente: 0,
    garantia_total: 0
  };

  productos: ProductoResponse[] = [];

  constructor(
    private productoService: ProductoService, 
    private marcaService: MarcaService,
    private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarSelect();
  }

  buscarSubM(){
    this.marcaService.getSubs(this.MarcaSelect).subscribe(
      (data: CategoriaMarcaResponse[]) => {
        this.CategoriaMarca = data;
        this.nuevoProducto.id_categoriamarca = this.CategoriaMarca[0].id; //predeterminado index 1
        console.log('Data Marca:', data.length);
      },
      error => {
        console.error('Error: ', error);
      }
    );
  }

  buscarSubC(){
    this.categoriaService.getSubs(this.CategoriaSelect).subscribe(
      (data: SubCategoriaResponse[]) => {
        this.Subcategoria = data;
        this.nuevoProducto.id_subcategoria = this.Subcategoria[0].id; //predeterminado index 1
        console.log('Data Categoria:', data.length);
      },
      error => {
        console.error('Error: ', error);
      }
    );
  }

  cargarSelect(){

    this.marcaService.getAll().subscribe(
      data => {this.Marcas = data;
    });
    
    this.categoriaService.getAll().subscribe(
      data => {this.Categoria = data}
    );
  }

  cargarProductos() {
    this.productoService.getListaProductos().subscribe(response => {
      this.productos = response;
    }, error => {
      console.error('Error al obtener las categorías:', error);
    });
  }

  selectedFiles: File[] = [];
  
  guardarProductos() {

    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(this.nuevoProducto)], { type: 'application/json' }));
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.productoService.postNuevoProducto(formData).subscribe({
      next: () => {
        //actualizar productos
        this.cargarProductos();
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado',
          text: 'El producto ha sido agregado al inventario.',
        });
        
      },
      error:(error)  => {
        Swal.fire({
          icon: 'error',
          title: 'Producto no agregado',
          text: error,
        });
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      this.selectedFiles = Array.from(event.target.files);
    }
  }
}