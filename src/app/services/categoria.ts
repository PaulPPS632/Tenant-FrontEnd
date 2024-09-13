import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoriaRequest } from '../models/categoria-request';
import { CategoriaResponse } from '../models/categoria-response';
import { MarcaResponse } from '../models/marca-response';
import { SubCategoriaResponse } from '../models/subcategoria-response';
import { SubCategoriaRequest } from '../models/subcategoria-request';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { CookieService } from 'ngx-cookie-service';
import { enviroment } from '../enviroments/enviroment';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl: string = enviroment.apiUrl + "/inventory/categoria";
  Url: string = enviroment.apiUrl + "/inventory/subcategoria";

  constructor(private http:HttpClient, private cookiesService: CookieService) {}

  getAll(): Observable<CategoriaResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    console.log("tenant" + this.cookiesService.get('tenantId'))
    return this.http.get<CategoriaResponse[]>(this.apiUrl, {headers: headers});
  }
  
  postCategoria(categoria: CategoriaRequest): Observable<any> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.post<CategoriaRequest>(`${this.apiUrl}`, categoria, {headers: headers});
  }

  postSubCategoria(subCategoria: SubCategoriaRequest): Observable<any> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.post<any>(`${this.Url}`, subCategoria, {headers: headers});
  }

  getSubs(id: number): Observable<SubCategoriaResponse[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<SubCategoriaResponse[]>(`${this.apiUrl}/subs/${id}`, {headers: headers});
  }

  actualizarCategoria(id: number, categoria: CategoriaMarcaRequest): Observable<any> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.put(`${this.apiUrl}/${id}`, categoria, {headers: headers});
  }
  
}