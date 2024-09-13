import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../usuario/account.service';
import { UserInfo } from '../models/UserInfo';

@Component({
  selector: 'app-paginas',
  templateUrl: './paginas.component.html',
  styleUrls: ['./paginas.component.scss']
})
export class PaginasComponent {

  constructor(private router: Router, private cookieService: CookieService, private accounService: AccountService, private cookiesService: CookieService){}
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
    rol: null,
  };
  privilegios: string[] =[];

  ngOnInit(){
    
    const userString = this.cookieService.get('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
    console.log(this.user);
  }
  Salir(){
    this.cookieService.delete('tenantId');
    this.cookieService.delete('user');
    this.router.navigateByUrl('');
  }

  buscaprivilegio(privilegeName: string): boolean {
    return this.user.rol?.privilegios?.some(privilegio => privilegio.nombre === privilegeName) ?? false;
  }
}
