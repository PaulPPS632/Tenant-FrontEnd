import { Component, OnInit } from '@angular/core';
import { VentaResponse } from 'src/app/models/venta-request';
import { RegistroVentaService } from 'src/app/services/registro-venta';

@Component({
  selector: 'app-lista-facturacion',
  templateUrl: './lista-facturacion.component.html',
  styleUrls: ['./lista-facturacion.component.scss']
})
export class ListaFacturacionComponent{
  Ventas: VentaResponse[]=[];
  constructor(private ventaService: RegistroVentaService){
    ventaService.Listar().subscribe(
      (data: VentaResponse[]) =>{
        this.Ventas = data;
        console.log(data);
      }
    )
  }
}
