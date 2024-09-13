import { Component } from '@angular/core';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.scss']
})
export class ComprobantesComponent {
  ListaSeleccionada : string = 'salidas';
  get flag(): boolean{
    return this.ListaSeleccionada=='salidas';
  }

  
}
