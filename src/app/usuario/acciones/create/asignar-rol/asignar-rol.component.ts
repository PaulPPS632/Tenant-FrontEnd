import { Component, Input, OnInit } from '@angular/core';
import { RolResponse } from 'src/app/models/RolResponse';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-rol',
  templateUrl: './asignar-rol.component.html',
  styleUrls: ['./asignar-rol.component.scss']
})
export class AsignarRolComponent implements OnInit {
  constructor (
    private usuarioService: UserService
  ){
  }
  @Input() usuario: UserInfo | null = null;
  roles: RolResponse[]=[];
  RolSelect: string = '';
  ngOnInit(): void {
    this.usuarioService.getRoles().subscribe(
      (data: RolResponse[]) => {
        this.roles = data;
      }
    )
  }
  asignarRol(){
    const selectedRole = this.roles.find(role => role.id == this.RolSelect);
    if (this.usuario != null && selectedRole !=null) {

      this.usuario.rol = selectedRole;

      this.usuarioService.putUsuario(this.usuario).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Rol Asignado',
            text: 'El Rol ha sido asignado al usuario' + this.usuario?.name,
          });
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Rol no asignado',
            text: error,
          });
        }
      );
    }
    
  }
}
