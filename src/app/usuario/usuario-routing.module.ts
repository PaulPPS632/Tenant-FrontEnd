import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioListComponent } from './acciones/usuario-list/usuario-list.component';
import { UsuarioSearchComponent } from './acciones/usuario-search/usuario-search.component';
import { UsuarioVentaComponent } from './facturacion/usuario-venta/usuario-venta.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProductoCreateComponent } from './acciones/create/producto-create/producto-create.component';
import { CategoriaCreateComponent } from './acciones/create/categoria-create/categoria-create.component';
import { MarcaCreateComponent } from './acciones/create/marca-create/marca-create.component';
import { RegistrarComponent } from '../autenticacion/registrar/registrar.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { IngresoCompraComponent } from './ingresos/ingreso-compra/ingreso-compra.component';
import { PedidosRestockComponent } from './pedidos/pedidos-restock/pedidos-restock.component';
import { ComprobantesComponent } from './comprobantes/comprobantes.component';

const routes: Routes = [
  {path: 'categoriamarca/search', component: UsuarioSearchComponent},
  {path: 'productos/crear', component: ProductoCreateComponent},
  {path: 'productos/list', component: UsuarioListComponent},
  {path: 'facturacion/ventas', component: UsuarioVentaComponent},
  {path: 'facturacion/ingresos', component: IngresoCompraComponent},
  {path: 'inicio', component:InicioComponent},
  {path: 'productos/subs/categoria', component: CategoriaCreateComponent},
  {path: 'productos/subs/marca', component: MarcaCreateComponent},
  {path: 'autenticacion/registrar', component: RegistrarComponent},
  {path: 'admin', component: AdminUsersComponent},
  {path: 'pedidos', component: PedidosRestockComponent},
  {path: 'comprobantes', component: ComprobantesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsuarioRoutingModule { }