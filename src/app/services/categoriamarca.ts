import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoriamarcaService {

  apiUrl: string = enviroment.apiUrl +  "/inventory/categoriamarca";

  constructor(private http: HttpClient) { }

  getCategoriaMarcas(): Observable<CategoriaMarcaRequest[]> {
    return this.http.get<CategoriaMarcaRequest[]>(this.apiUrl);
  }

  deleteCategoriaMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
