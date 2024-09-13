import { Injectable } from '@angular/core';
import { UserInfo } from '../models/UserInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CompraResponse, RegistrarCompraRequest } from '../models/Compra-request';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RegistroCompraService {
  private readonly Url = enviroment.apiUrl +  "/inventory/registrocompra";

  constructor(private http: HttpClient, private cookiesService: CookieService) { }
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
  registrar(compraRequest: RegistrarCompraRequest): Observable<void> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    const userString = this.cookiesService.get('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
    compraRequest.usuario_id = this.user.id;
    console.log(compraRequest);
    return this.http.post<void>(this.Url, compraRequest, {headers});
  }
  Listar(): Observable<CompraResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<CompraResponse[]>(this.Url,{headers});
  }
}
