import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { CategoriaService } from '../services/categoria';

import { UsuarioVentaComponent } from './facturacion/usuario-venta/usuario-venta.component';

import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { UsuarioListComponent } from './acciones/usuario-list/usuario-list.component';
import { UsuarioSearchComponent } from './acciones/usuario-search/usuario-search.component';
import { InicioComponent } from './inicio/inicio.component';
import { MarcaCreateComponent } from './acciones/create/marca-create/marca-create.component';
import { CategoriaCreateComponent } from './acciones/create/categoria-create/categoria-create.component';
import { ProductoCreateComponent } from './acciones/create/producto-create/producto-create.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AsignarRolComponent } from './acciones/create/asignar-rol/asignar-rol.component';
import { IngresoCompraComponent } from './ingresos/ingreso-compra/ingreso-compra.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { PedidosRestockComponent } from './pedidos/pedidos-restock/pedidos-restock.component';
import { ListaFacturacionComponent } from './facturacion/lista-facturacion/lista-facturacion.component';
import { ListaIngresosComponent } from './ingresos/lista-ingresos/lista-ingresos.component';
import { ComprobantesComponent } from './comprobantes/comprobantes.component';

@NgModule({
  declarations: [
    UsuarioListComponent,
    UsuarioSearchComponent,
    UsuarioVentaComponent,
    InicioComponent,
    MarcaCreateComponent,
    ProductoCreateComponent,
    CategoriaCreateComponent,
    AdminUsersComponent,
    AsignarRolComponent,
    IngresoCompraComponent,
    PedidosRestockComponent,
    ListaFacturacionComponent,
    ListaIngresosComponent,
    ComprobantesComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    UsuarioRoutingModule,
    MatCheckboxModule,
    HighchartsChartModule
  ],
  providers:[CategoriaService]
})
export class UsuarioModule { }
