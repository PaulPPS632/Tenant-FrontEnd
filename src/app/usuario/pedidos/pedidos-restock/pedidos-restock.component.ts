import { Component, OnInit } from '@angular/core';
import { PedidoResponse } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedidos-restock',
  templateUrl: './pedidos-restock.component.html',
  styleUrls: ['./pedidos-restock.component.scss']
})
export class PedidosRestockComponent implements OnInit {
  constructor(private pedidosService: PedidoService){}
  pedidos: PedidoResponse[]=[];

  ngOnInit(): void {
    this.pedidosService.listar().subscribe(
      (data: PedidoResponse[]) =>{
        this.pedidos = data;
      }
    )
  }

}
