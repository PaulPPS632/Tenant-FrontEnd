import { Component } from '@angular/core';
import { UserInfo } from 'src/app/models/UserInfo';
import { AccountService } from 'src/app/usuario/account.service';
import { Message } from 'src/app/usuario/message';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../AuthService.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-accountgoogle',
  templateUrl: './accountgoogle.component.html',
  styleUrls: ['./accountgoogle.component.scss']
})
export class AccountgoogleComponent {
  content: string = "";
  user: UserInfo = {
    id: '',
    sub: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
    email: '',
    email_verified: false,
    locale: '',
    password:'',
    tenantId : '',
    tenantName:'',
    regist: false,
    tiponegocio: '',
    rol: null
  };
  constructor(private accountService: AccountService, private router: Router, private cookieService: CookieService, private authService: AuthService) {}
  ngOnInit(): void {
    //this.http.getPrivate("/messages").subscribe((data: Message) => this.content = data.message);
    /*this.accountService.getUserInfo("/user/regist", this.user).subscribe((data: UserInfo) => {
      this.user = data;
      if(this.user.tenantId !== ''){
        this.cookieService.set('tenantId', this.user.tenantId);
        this.router.navigateByUrl('/dashboard/usuario/inicio');
      }
    });*/
    this.accountService.getUserInfo("/user/regist",this.user).subscribe(
      (data: UserInfo) =>{
        this.user = data;
        if(data.regist){
          this.cookieService.set('tenantId', this.user.tenantId);
          console.log(data);
          if(data.rol?.nombre != null){
            this.almacenarDatosUsuarioCookies(this.user);
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
        }else{
          if(this.user.email == ""){
            this.registrar(true);
          }else{
            this.registrar(false);
          }
          
        }

      }
    );
  }
  registrar(flag: boolean){
    this.authService.setIsRegistering(flag);
    this.router.navigateByUrl('autenticacion/registrar');
  }
  almacenarDatosUsuarioCookies(usuario: UserInfo){
    const userString = JSON.stringify(usuario);
    this.cookieService.set('user', userString);
  }
}
