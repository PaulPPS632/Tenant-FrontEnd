import { Component } from '@angular/core';
import { CompraResponse } from 'src/app/models/Compra-request';
import { RegistroCompraService } from 'src/app/services/registro-compra.service';

@Component({
  selector: 'app-lista-ingresos',
  templateUrl: './lista-ingresos.component.html',
  styleUrls: ['./lista-ingresos.component.scss']
})
export class ListaIngresosComponent {
  Compras: CompraResponse[]=[];
  constructor(private ventaService: RegistroCompraService){
    ventaService.Listar().subscribe(
      (data: CompraResponse[]) =>{
        this.Compras = data;
        console.log(data);
      }
    )
  }
}
