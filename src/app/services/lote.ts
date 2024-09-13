import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor() { }

  apiUrl: string = enviroment.apiUrl +  "/inventory/lote";
}
