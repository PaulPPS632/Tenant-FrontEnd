import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { VentaReporteDto } from '../models/VentaReporteDto';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  apiUrl: string = enviroment.apiUrl +  "/inventory";

  constructor(private http: HttpClient, private cookiesService: CookieService) {}

  getVentasReporte(): Observable<VentaReporteDto[]> {
    const headers = new HttpHeaders({
      'tenantId': this.cookiesService.get('tenantId') // Reemplaza con el valor adecuado
    });
    return this.http.get<VentaReporteDto[]>(this.apiUrl + "/reportes", {headers});
  }
}
