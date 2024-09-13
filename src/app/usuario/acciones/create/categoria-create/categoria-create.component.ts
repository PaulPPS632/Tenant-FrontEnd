import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaRequest } from 'src/app/models/categoria-request';
import { CategoriaResponse } from 'src/app/models/categoria-response';
import { SubCategoriaRequest } from 'src/app/models/subcategoria-request';
import { SubCategoriaResponse } from 'src/app/models/subcategoria-response';
import { CategoriaService } from 'src/app/services/categoria';
import { SubcategoriaService } from 'src/app/services/subcategoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-create',
  templateUrl: './categoria-create.component.html',
  styleUrls: ['./categoria-create.component.scss']
})
export class CategoriaCreateComponent implements OnInit{

  closeResult = '';

  CategoriaSelect : number = 0;
  Categoria : CategoriaResponse [] = [];
  Subcategoria: SubCategoriaResponse [] = [];


  nuevaCategoria: CategoriaRequest = { 
    nombre: '' ,
    descripcion:''
  };

  nuevaSubcategoria: SubCategoriaRequest = {
    nombre: '',
    descripcion: '',
    id_categoria: 0
  };

  constructor( 
    private modalService: NgbModal,
    private categoriaService: CategoriaService,
    private subcategoriaService: SubcategoriaService) { }

  ngOnInit() {
    this.cargarCategoria();
  }

  cargarCategoria(){
    this.categoriaService.getAll().subscribe(response => {
      this.Categoria = response;
    }, error => {
      console.error('Error al obtener las categorias:', error);
    });
  }


  guardarCategoria() {
    console.log(this.nuevaCategoria);
    this.categoriaService.postCategoria(this.nuevaCategoria).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoria agregada',
          text: 'La categoria ha sido agregado al inventario.',
        });
        //actualizar categoria
        this.cargarCategoria();
      },
      error:(error)  => {
        Swal.fire({
          icon: 'error',
          title: 'Categoria no agregada',
          text: error,
        });
      }
    });
  }

  guardarSubCategoria() {
    this.nuevaSubcategoria.id_categoria = this.CategoriaSelect;

    this.categoriaService.postSubCategoria(this.nuevaSubcategoria).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Subcategoría agregada',
          text: 'La subcategoría ha sido agregada correctamente.',
        });
        //actualizar subcategoria
        this.cargarSubcategorias();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar subcategoría',
          text: error,
        });
      }
    });

    this.nuevaSubcategoria = {
      nombre: '',
      descripcion: '',
      id_categoria: this.CategoriaSelect
    };
  }

  cargarSubcategorias() {
    this.categoriaService.getSubs(this.CategoriaSelect).subscribe(
      (data: SubCategoriaResponse[]) => {
        this.Subcategoria = data;
        console.log('Subcategoria cargada.');
      },
      error => {
        console.error('Error al obtener subcategorías: ', error);
      }
    );
  }

  seleccionarCategoria(id: number) {
    this.CategoriaSelect = id;

    this.categoriaService.getSubs(this.CategoriaSelect).subscribe(
      (data: SubCategoriaResponse[]) => {
        this.Subcategoria = data;
      },
      error => {
        console.error('Error: ', error);
      }
    );
  }


  eliminarSubCategoria(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subcategoriaService.deleteSubCategoria(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La subcategoría ha sido eliminada.',
              'success'
            );
            this.cargarSubcategorias();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar subcategoría',
              text: error,
            });
          }
        });
      }
    });
  }
  


  abrirModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-header modal-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
