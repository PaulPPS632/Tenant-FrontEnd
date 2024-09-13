import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/models/UserInfo';
import { AuthService } from '../AuthService.service';
import { AccountService } from 'src/app/usuario/account.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {
  isLoading = false;
  codigo: string = "" ;
  tipoNegocio: string = "";
  email: string = "";
  password: string = "";
  tenantname: string = "";
  registrado:boolean = false;

  constructor(private authService: AuthService, private AccountService: AccountService, private cookieService: CookieService, private router: Router) {}

  ngOnInit() {
    this.authService.isRegistering$.subscribe(registro => {
      this.registrado = registro;
    });
  }


  Registrar(){
    const nuevoUser: UserInfo = {
      id: '',
      sub: '',
      name: '',
      given_name: '',
      family_name: '',
      picture: '',
      email: this.email,
      email_verified: this.registrado,
      locale: '',
      password: this.password,
      tenantId: this.codigo,
      tenantName: this.tenantname,
      regist: this.registrado,
      tiponegocio: this.tipoNegocio,
      rol: null
    };
    this.isLoading = true;
    this.AccountService.getUserInfo("/user/regist", nuevoUser).subscribe(
      (data: UserInfo) =>{
        this.isLoading = false;
        if(data.regist && data.rol?.nombre != null){
          this.cookieService.set('tenantId', data.tenantId);
          const userString = JSON.stringify(data);
          this.cookieService.set('user', userString);
          this.router.navigateByUrl('/dashboard/usuario/inicio');
        }else{
          Swal.fire({
            icon: 'info',
            title: 'Solicita a tu Administrador un Rol',
            text: 'tu usuario esta creado pero no cuenta con un rol asignado',
            confirmButtonText:"OK"
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/');
            }
          });
        }
      },
      (error) => {
        this.isLoading = false;
        console.error(error);
        // Manejo del error aquí
      }
    )
  }
almacenarDatosUsuarioCookies(usuario: UserInfo){
    
  }

}
