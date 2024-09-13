import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoResponse } from '../models/producto-response';
import { Observable } from 'rxjs';
import { ProductoRequest } from '../models/producto-request';
import { CookieService } from 'ngx-cookie-service';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiUrl: string = enviroment.apiUrl +  "/inventory/producto";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}

  getListaProductos(): Observable<ProductoResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<ProductoResponse[]>(this.apiUrl, {headers});
  }

  postNuevoProducto(productoNuevo: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.post<any>(`${this.apiUrl}`,productoNuevo, {headers: headers});
  }

  deleteProducto(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: headers});
  }
}
