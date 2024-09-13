import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaMarcaRequest } from 'src/app/models/categoriamarca-request';
import { CategoriaMarcaResponse } from 'src/app/models/categoriamarca-response';
import { MarcaRequest } from 'src/app/models/marca-request';
import { MarcaResponse } from 'src/app/models/marca-response';
import { CategoriamarcaService } from 'src/app/services/categoriamarca';
import { MarcaService } from 'src/app/services/marca';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marca-create',
  templateUrl: './marca-create.component.html',
  styleUrls: ['./marca-create.component.scss']
})

export class MarcaCreateComponent implements OnInit{

  closeResult = '';

  MarcaSelect : number = 0;
  Marca : MarcaResponse [] = [];
  CategoriaMarca: CategoriaMarcaResponse [] = [];

  nuevaMarca: MarcaRequest = { 
    nombre: ''
  };

  nuevaCategoriaMarca: CategoriaMarcaRequest = {
    nombre: '',
    id_marca: 0
  };

  constructor( private modalService: NgbModal, 
    private marcaService: MarcaService, 
    private categoriMarcarService: CategoriamarcaService) { }

  ngOnInit() {
    this.cargarMarca();
  }

  cargarMarca(){
    this.marcaService.getAll().subscribe(response => {
      this.Marca = response;
      console.log(this.Marca);
    }, error => {
      console.error('Error al obtener las marcas:', error);
    });
  }

  guardarMarca() {
    this.marcaService.postMarca(this.nuevaMarca).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Marca agregada',
          text: 'La Marca ha sido agregado al inventario.',
          
        });
        //actualizar marca
        this.cargarMarca();
      },
      error:(error)  => {
        Swal.fire({
          icon: 'error',
          title: 'Marca no agregada',
          text: error,
        });
      }
    });
  }

  guardarCategoriaMarca() {

    this.nuevaCategoriaMarca.id_marca = this.MarcaSelect;

    this.marcaService.postCategoriaMarca(this.nuevaCategoriaMarca).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoria Marca agregada',
          text: 'La categoria marca ha sido agregada correctamente.',
        });
        //actualizar Categoria Marca
        this.cargarCategoriaMarca();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar categoria marca',
          text: error,
        });
      }
    });

    this.nuevaCategoriaMarca = {
      nombre: '',
      id_marca: this.MarcaSelect
    };
  }

  cargarCategoriaMarca() {
    this.marcaService.getSubs(this.MarcaSelect).subscribe(
      (data: CategoriaMarcaResponse[]) => {
        this.CategoriaMarca = data;
        console.log('Categoria marca cargada.');
      },
      error => {
        console.error('Error al obtener categoria marca: ', error);
      }
    );
  }

  seleccionarMarca(id: number) {
    this.MarcaSelect = id;

    this.marcaService.getSubs(this.MarcaSelect).subscribe(
      (data: CategoriaMarcaResponse[]) => {
        this.CategoriaMarca = data;
      },
      error => {
        console.error('Error: ', error);
      }
    );
  }

  eliminarCategoriaMarca(id: number) {
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
        this.categoriMarcarService.deleteCategoriaMarca(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La categoria marca ha sido eliminada.',
              'success'
            );
            this.cargarCategoriaMarca();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar categoria marca',
              text: error,
            });
          }
        });
      }
    });
  }

  editarCategoriaMarca(id: number){
    
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
